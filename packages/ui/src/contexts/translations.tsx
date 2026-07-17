'use client';

import {
  cloneElement,
  createContext,
  isValidElement,
  type ReactElement,
  type ReactNode,
  use,
  useMemo,
} from 'react';

type Translations = Partial<Record<string, string>>;
type Variables = Record<string, ReactNode>;
type TagRenderer = ReactElement | ((children: ReactNode) => ReactNode);

const TranslationContext = createContext<Translations>({});
const variablePattern = /\\?\{([^}]+)\}/g;
const tagPattern = /\\?<([^>]+)>/g;

export function TranslationProvider({
  translations,
  children,
}: {
  translations: Translations;
  children: ReactNode;
}) {
  const parent = use(TranslationContext);
  const value = useMemo(() => ({ ...parent, ...translations }), [parent, translations]);

  return <TranslationContext value={value}>{children}</TranslationContext>;
}

export interface TranslationOptions {
  note?: string;
  variables?: Record<string, string>;
}

export interface TranslationsHook {
  translations: Translations;
  (text: string, options?: TranslationOptions): string;
  jsx(
    text: string,
    options?: {
      note?: string;
      variables?: Variables;
      tags?: Record<string, TagRenderer>;
    },
  ): ReactNode;
}

export function useTranslations({ note }: { note?: string } = {}): TranslationsHook {
  const translations = use(TranslationContext);
  return useMemo(() => fromTranslations(translations, { note }), [translations, note]);
}

export function fromTranslations(
  translations: Translations,
  { note: defaultNote }: { note?: string } = {},
): TranslationsHook {
  const translate = ((rawText: string, options: TranslationOptions = {}) => {
    const text = translations[translationKey(rawText, defaultNote, options.note)] ?? rawText;
    if (!options.variables) return text;

    return text.replace(variablePattern, (match, name: string) => {
      if (match.startsWith('\\')) return match.slice(1);
      return options.variables?.[name] ?? match;
    });
  }) as TranslationsHook;

  translate.jsx = (rawText, options = {}) => {
    const text =
      translations[translationKey(rawText, defaultNote, options.note)] ?? rawText;

    if (options.tags) return renderTags(text, options.variables, options.tags);
    if (options.variables) return renderVariables(text, options.variables);
    return text;
  };
  translate.translations = translations;

  return translate;
}

function translationKey(text: string, ...notes: (string | undefined)[]) {
  return text + notes.filter(Boolean).map((note) => `(${note})`).join('');
}

function renderVariables(text: string, variables: Variables): ReactNode {
  const output: ReactNode[] = [];
  let index = 0;

  for (const match of text.matchAll(variablePattern)) {
    if (index < match.index) output.push(text.slice(index, match.index));
    index = match.index + match[0].length;

    if (match[0].startsWith('\\')) {
      output.push(match[0].slice(1));
    } else {
      output.push(withKey(variables[match[1]] ?? match[0], index));
    }
  }

  output.push(text.slice(index));
  return output;
}

function renderTags(
  text: string,
  variables: Variables | undefined,
  tags: Record<string, TagRenderer>,
) {
  const stack: { children: ReactNode[]; tag?: string }[] = [{ children: [] }];
  let index = 0;

  const closeTag = () => {
    const current = stack.pop()!;
    const parent = stack.at(-1)!;
    const rendered =
      current.tag && tags[current.tag]
        ? renderTag(tags[current.tag], current.children)
        : current.children;
    parent.children.push(withKey(rendered, index));
  };

  for (const match of text.matchAll(tagPattern)) {
    const current = stack.at(-1)!;
    if (index < match.index) {
      const value = text.slice(index, match.index);
      current.children.push(variables ? renderVariables(value, variables) : value);
    }
    index = match.index + match[0].length;

    const token = match[0];
    const name = match[1];
    if (token.startsWith('\\')) {
      const value = token.slice(1);
      current.children.push(variables ? renderVariables(value, variables) : value);
    } else if (name.startsWith('/')) {
      if (current.tag === name.slice(1)) closeTag();
      else current.children.push(token);
    } else if (name.endsWith('/')) {
      const renderer = tags[name.slice(0, -1)];
      current.children.push(renderer ? withKey(renderTag(renderer), index) : token);
    } else {
      stack.push({ children: [], tag: name });
    }
  }

  if (index < text.length) {
    const value = text.slice(index);
    stack.at(-1)!.children.push(variables ? renderVariables(value, variables) : value);
  }
  while (stack.length > 1) closeTag();

  return stack[0].children;
}

function renderTag(renderer: TagRenderer, children?: ReactNode) {
  if (isValidElement(renderer)) {
    return children === undefined ? renderer : cloneElement(renderer, undefined, children);
  }
  return renderer(children);
}

function withKey(value: ReactNode, key: number): ReactNode {
  return isValidElement(value) ? cloneElement(value, { key }) : value;
}

export function T({
  text,
  note,
  variables,
  tags,
}: {
  text: string;
  note?: string;
  variables?: Variables;
  tags?: Record<string, TagRenderer>;
}) {
  const translate = useTranslations();
  return translate.jsx(text, { note, variables, tags });
}
