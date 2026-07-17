import { Project, type ExportedDeclarations, type Symbol as TsSymbol, type Type } from 'ts-morph';
import fs from 'node:fs/promises';
import path from 'node:path';

export interface RawTag {
  name: string;
  text: string;
}

export interface DocEntry {
  name: string;
  description: string;
  type: string;
  simplifiedType: string;
  tags: RawTag[];
  required: boolean;
  deprecated: boolean;
}

export interface GeneratedDoc {
  id: string;
  name: string;
  description?: string;
  entries: DocEntry[];
}

export interface GenerateOptions {
  /** Include `@internal` members. @defaultValue false */
  allowInternal?: boolean;
}

export interface TypescriptConfig {
  tsconfigPath?: string;
}

export interface GeneratorOptions extends TypescriptConfig {
  project?: Project;
}

export type Generator = ReturnType<typeof createGenerator>;

export async function createProject(options: TypescriptConfig = {}): Promise<Project> {
  return new Project({
    tsConfigFilePath: options.tsconfigPath ?? './tsconfig.json',
    skipAddingFilesFromTsConfig: true,
  });
}

function simplifyType(type: Type): string {
  if (type.isUndefined()) return 'undefined';
  if (type.isNull()) return 'null';
  if (type.isString() || type.isStringLiteral()) return 'string';
  if (type.isNumber() || type.isNumberLiteral()) return 'number';
  if (type.isBoolean() || type.isBooleanLiteral()) return 'boolean';
  if (type.isArray() || type.isReadonlyArray()) return 'array';
  if (type.getCallSignatures().length > 0) return 'function';

  const alias = type.getAliasSymbol();
  if (alias) {
    const args = type.getAliasTypeArguments();
    if (args.length === 0) return alias.getName();
    return `${alias.getName()}<${args.map(simplifyType).join(', ')}>`;
  }

  if (type.isUnion()) {
    const members = type.getUnionTypes().filter((t) => !t.isUndefined());
    if (members.length === 1) return simplifyType(members[0]!);
    return 'union';
  }

  if (type.isClassOrInterface() || type.isObject()) return 'object';
  return type.getText().replace(/import\(".*"\)\./g, '');
}

function getDocEntry(
  prop: TsSymbol,
  declaration: ExportedDeclarations,
  allowInternal: boolean,
): DocEntry | undefined {
  if (prop.getName().startsWith('#')) return;

  const subType = prop.getTypeAtLocation(declaration);
  const tags: RawTag[] = [];

  for (const tag of prop.getJsDocTags()) {
    if (!allowInternal && tag.getName() === 'internal') return;
    tags.push({
      name: tag.getName(),
      text: tag
        .getText()
        .map((p) => p.text)
        .join(''),
    });
  }

  const description = prop
    .getDeclarations()
    .flatMap((d) => {
      if ('getJsDocs' in d && typeof d.getJsDocs === 'function') {
        return (d.getJsDocs() as { getDescription(): string }[]).map((doc) =>
          doc.getDescription().trim(),
        );
      }
      return [];
    })
    .filter(Boolean)
    .join('\n\n');

  const fullType = subType
    .getText(declaration)
    .replace(/import\(".*"\)\./g, '');

  let simplifiedType = simplifyType(subType);
  let deprecated = false;

  for (const tag of tags) {
    if (tag.name === 'remarks') {
      const match = /^`(?<name>.+)`/.exec(tag.text)?.[1];
      if (match) simplifiedType = match;
    }
    if (tag.name === 'deprecated') deprecated = true;
  }

  return {
    name: prop.getName(),
    description,
    tags,
    type: fullType,
    simplifiedType,
    required: !prop.isOptional(),
    deprecated,
  };
}

export function createGenerator(options: GeneratorOptions = {}) {
  let instance: Project | Promise<Project> | undefined = options.project;

  function getProject() {
    if (instance) return instance;
    return (instance = createProject(options));
  }

  function getSourceFile(project: Project, filePath: string, fileContent: string) {
    const existing = project.getSourceFile(filePath);
    if (existing && existing.getFullText() === fileContent) return existing;
    return project.createSourceFile(filePath, fileContent, { overwrite: true });
  }

  return {
    async generateDocumentation(
      file: { path: string; content?: string },
      name: string | undefined,
      opts: GenerateOptions = {},
    ): Promise<GeneratedDoc[]> {
      const fullPath = path.resolve(file.path);
      const content = file.content ?? (await fs.readFile(fullPath, 'utf-8'));
      const project = await getProject();
      const sourceFile = getSourceFile(project, fullPath, content);
      const out: GeneratedDoc[] = [];
      const allowInternal = opts.allowInternal ?? false;

      for (const [exportName, declarations] of sourceFile.getExportedDeclarations()) {
        if (!name || name !== exportName || declarations.length === 0) continue;
        const declaration = declarations[0]!;
        const entries: DocEntry[] = [];

        for (const prop of declaration.getType().getProperties()) {
          const entry = getDocEntry(prop, declaration, allowInternal);
          if (entry) entries.push(entry);
        }

        const jsDocs =
          'getJsDocs' in declaration && typeof declaration.getJsDocs === 'function'
            ? (declaration.getJsDocs() as { getDescription(): string }[])
                .map((d) => d.getDescription().trim())
                .filter(Boolean)
            : [];

        out.push({
          id: encodeURI(`${path.basename(file.path)}-${name}`),
          name: exportName,
          description: jsDocs.join('\n\n') || undefined,
          entries,
        });
      }

      return out;
    },

    async generateTypeTable(
      props: BaseTypeTableProps,
      options?: GenerateTypeTableOptions,
    ): Promise<GeneratedDoc[]> {
      return getTypeTableOutput(this, props, options);
    },
  };
}

export interface BaseTypeTableProps {
  path?: string;
  name?: string;
  type?: string;
}

export interface GenerateTypeTableOptions extends GenerateOptions {
  basePath?: string;
}

export async function getTypeTableOutput(
  gen: Generator,
  { name, type, ...props }: BaseTypeTableProps,
  options?: GenerateTypeTableOptions,
): Promise<GeneratedDoc[]> {
  const file =
    props.path && options?.basePath ? path.join(options.basePath, props.path) : props.path;
  let typeName = name;
  let content = '';

  if (file) {
    content = await fs.readFile(file, 'utf-8');
  }

  if (type && type.split('\n').length > 1) {
    content += `\n${type}`;
  } else if (type) {
    typeName ??= '$Watanuki';
    content += `\nexport type ${typeName} = ${type}`;
  }

  const output = await gen.generateDocumentation(
    { path: file ?? 'temp.ts', content },
    typeName,
    options,
  );

  if (name && output.length === 0) {
    throw new Error(`${name} in ${file ?? 'empty file'} doesn't exist`);
  }

  return output;
}

export interface ParameterTag {
  name: string;
  description?: string;
}

export interface TypedTags {
  default?: string;
  params?: ParameterTag[];
  returns?: string;
}

export function parseTags(tags: RawTag[]): TypedTags {
  const typed: TypedTags = {};

  for (const { name: key, text } of tags) {
    if (key === 'default' || key === 'defaultValue') {
      typed.default = text;
      continue;
    }

    if (key === 'param') {
      const sepIdx = text.indexOf('-');
      const param = sepIdx === -1 ? text.trim() : text.slice(0, sepIdx).trim();
      const description = sepIdx === -1 ? '' : text.slice(sepIdx + 1).trim();
      typed.params ??= [];
      typed.params.push({ name: param, description });
      continue;
    }

    if (key === 'returns') {
      typed.returns = text;
    }
  }

  return typed;
}
