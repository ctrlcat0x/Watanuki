import {
  TypeTable,
  type ParameterNode,
  type TypeNode,
} from '@watanuki/ui/components/type-table';
import type { ComponentProps, ReactNode } from 'react';
import {
  type BaseTypeTableProps,
  type GenerateTypeTableOptions,
  type Generator,
  parseTags,
} from '../index';

export interface AutoTypeTableProps extends BaseTypeTableProps, ComponentProps<'div'> {
  generator: Generator;
  options?: GenerateTypeTableOptions;
  /** Override type rendering (defaults to monospace string) */
  renderType?: (type: string) => ReactNode;
  /** Override description rendering (defaults to plain text) */
  renderMarkdown?: (md: string) => ReactNode;
}

/**
 * Server component: resolve a TypeScript export into `<TypeTable />`.
 *
 * ```tsx
 * const generator = createGenerator()
 * <AutoTypeTable generator={generator} path="./types.ts" name="ButtonProps" />
 * ```
 */
export async function AutoTypeTable({
  generator,
  options,
  renderType = (v) => v,
  renderMarkdown = (v) => v,
  name,
  path: filePath,
  type,
  ...props
}: AutoTypeTableProps) {
  const output = await generator.generateTypeTable(
    { name, path: filePath, type },
    options,
  );

  return (
    <>
      {await Promise.all(
        output.map(async (item) => {
          const entries = await Promise.all(
            item.entries.map(async (entry): Promise<[string, TypeNode]> => {
              const tags = parseTags(entry.tags);
              const paramNodes: ParameterNode[] = (tags.params ?? []).map((param) => ({
                name: param.name,
                description: param.description
                  ? renderMarkdown(param.description)
                  : undefined,
              }));

              return [
                entry.name,
                {
                  type: renderType(entry.simplifiedType),
                  typeDescription: renderType(entry.type),
                  description: entry.description
                    ? renderMarkdown(entry.description)
                    : undefined,
                  default: tags.default ? renderType(tags.default) : undefined,
                  parameters: paramNodes,
                  required: entry.required,
                  deprecated: entry.deprecated,
                  returns: tags.returns ? renderMarkdown(tags.returns) : undefined,
                },
              ];
            }),
          );

          return (
            <TypeTable
              key={item.name}
              id={`type-table-${item.id}`}
              type={Object.fromEntries(entries)}
              {...props}
            />
          );
        }),
      )}
    </>
  );
}
