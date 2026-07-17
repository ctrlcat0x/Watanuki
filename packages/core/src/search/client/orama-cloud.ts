import type { SearchClient } from '@/search/client';
import { createContentHighlighter, type SortedResult } from '@/search';

export interface OramaCloudHitDocument {
  id?: string;
  url?: string;
  title?: string;
  content?: string;
  description?: string;
  breadcrumbs?: string[];
  type?: 'page' | 'heading' | 'text' | string;
  tag?: string | string[];
  locale?: string;
  [key: string]: unknown;
}

export interface OramaCloudHit {
  id?: string;
  document?: OramaCloudHitDocument;
  [key: string]: unknown;
}

export interface OramaCloudResponse {
  hits?: OramaCloudHit[];
}

export interface OramaCloudLikeClient {
  search: (params: Record<string, unknown>) => Promise<OramaCloudResponse>;
}

export interface OramaCloudOptions {
  client: OramaCloudLikeClient;
  index?: string;
  locale?: string;
  tag?: string | string[];
  params?: Record<string, unknown>;
  transformHit?: (hit: OramaCloudHit, query: string) => SortedResult | null;
}

function defaultTransformHit(hit: OramaCloudHit, query: string): SortedResult | null {
  const document = hit.document;
  if (!document?.url) return null;

  const highlighter = createContentHighlighter(query);
  const content = highlighter.highlightMarkdown(
    document.content ?? document.description ?? document.title ?? '',
  );

  return {
    id: document.id ?? hit.id ?? document.url,
    url: document.url,
    type:
      document.type === 'page' || document.type === 'heading' || document.type === 'text'
        ? document.type
        : 'page',
    content,
    breadcrumbs: document.breadcrumbs,
  };
}

export function oramaCloudClient({
  client,
  index,
  locale,
  tag,
  params = {},
  transformHit = defaultTransformHit,
}: OramaCloudOptions): SearchClient {
  return {
    deps: [index, locale, tag, JSON.stringify(params)],
    async search(query) {
      const res = await client.search({
        term: query,
        ...params,
        ...(index ? { index } : {}),
        ...(locale ? { locale } : {}),
        ...(tag ? { tag } : {}),
      });

      return (res.hits ?? [])
        .map((hit) => transformHit(hit, query))
        .filter((item): item is SortedResult => item !== null);
    },
  };
}
