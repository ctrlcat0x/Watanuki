import {
  transformerMetaHighlight,
  transformerNotationDiff,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from '@shikijs/transformers';
import type { ShikiTransformer } from 'shiki';
import { parseCodeBlockAttributes } from '@/mdx-plugins/codeblock-utils';

function parseLineNumbers(meta: string, data: Record<string, unknown>) {
  return meta.replace(/lineNumbers=(\d+)|lineNumbers/g, (_, start) => {
    data['data-line-numbers'] = true;
    if (start !== undefined) data['data-line-numbers-start'] = Number(start);
    return '';
  });
}

export function getDefaultCodeBlockTransformers(): ShikiTransformer[] {
  return [
    transformerMetaHighlight(),
    transformerNotationHighlight({
      matchAlgorithm: 'v3',
    }),
    transformerNotationWordHighlight({
      matchAlgorithm: 'v3',
    }),
    transformerNotationDiff({
      matchAlgorithm: 'v3',
    }),
    transformerNotationFocus({
      matchAlgorithm: 'v3',
    }),
  ];
}

export function buildCodeBlockMeta(metaString = ''): Record<string, unknown> {
  const parsed = parseCodeBlockAttributes(metaString, ['title', 'tab']);
  const data: Record<string, unknown> = parsed.attributes;
  const rest = parseLineNumbers(parsed.rest, data).trim();

  data.__raw = rest;
  return data;
}
