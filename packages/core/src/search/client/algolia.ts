import type { SearchClient } from '@/search/client';
import { createContentHighlighter, type SortedResult } from '@/search';

type Primitive = string | number | boolean | null | undefined;

export interface AlgoliaHit {
  objectID?: string;
  url?: string;
  type?: 'page' | 'heading' | 'text' | string;
  title?: string;
  content?: string;
  description?: string;
  breadcrumbs?: Primitive[] | Primitive;
  hierarchy?: Record<string, Primitive>;
  _snippetResult?: Record<string, { value?: string }>;
  _highlightResult?: Record<string, { value?: string }>;
  [key: string]: unknown;
}

export interface AlgoliaSearchResponse {
  hits?: AlgoliaHit[];
}

export interface AlgoliaOptions {
  appId: string;
  apiKey: string;
  indexName: string;
  locale?: string;
  tag?: string | string[];
  endpoint?: string;
  searchParams?: Record<string, unknown>;
  transformHit?: (hit: AlgoliaHit, query: string) => SortedResult | null;
}

function readString(input: unknown): string | undefined {
  return typeof input === 'string' && input.length > 0 ? input : undefined;
}

function normalizeBreadcrumbs(hit: AlgoliaHit): string[] | undefined {
  if (Array.isArray(hit.breadcrumbs)) {
    const breadcrumbs = hit.breadcrumbs.filter((item): item is string => typeof item === 'string');
    return breadcrumbs.length > 0 ? breadcrumbs : undefined;
  }

  if (typeof hit.breadcrumbs === 'string') {
    return [hit.breadcrumbs];
  }

  if (hit.hierarchy && typeof hit.hierarchy === 'object') {
    const breadcrumbs = Object.keys(hit.hierarchy)
      .sort()
      .map((key) => hit.hierarchy?.[key])
      .filter((item): item is string => typeof item === 'string' && item.length > 0);

    return breadcrumbs.length > 0 ? breadcrumbs : undefined;
  }
}

function normalizeContent(hit: AlgoliaHit, query: string): string {
  const highlighter = createContentHighlighter(query);

  return (
    readString(hit._snippetResult?.content?.value) ??
    readString(hit._highlightResult?.content?.value) ??
    readString(hit._highlightResult?.title?.value) ??
    highlighter.highlightMarkdown(
      readString(hit.content) ?? readString(hit.description) ?? readString(hit.title) ?? '',
    )
  );
}

function defaultTransformHit(hit: AlgoliaHit, query: string): SortedResult | null {
  const url = readString(hit.url);
  if (!url) return null;

  return {
    id: readString(hit.objectID) ?? url,
    url,
    type:
      hit.type === 'page' || hit.type === 'heading' || hit.type === 'text' ? hit.type : 'page',
    content: normalizeContent(hit, query),
    breadcrumbs: normalizeBreadcrumbs(hit),
  };
}

export function algoliaClient({
  appId,
  apiKey,
  indexName,
  locale,
  tag,
  endpoint = `https://${appId}-dsn.algolia.net/1/indexes/${indexName}/query`,
  searchParams = {},
  transformHit = defaultTransformHit,
}: AlgoliaOptions): SearchClient {
  return {
    deps: [appId, apiKey, indexName, locale, tag, JSON.stringify(searchParams)],
    async search(query) {
      const filters = [locale && `locale:${locale}`]
        .concat(
          Array.isArray(tag) ? tag.map((value) => `tag:${value}`) : tag ? [`tag:${tag}`] : [],
        )
        .filter(Boolean)
        .join(' AND ');

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-algolia-api-key': apiKey,
          'x-algolia-application-id': appId,
        },
        body: JSON.stringify({
          query,
          ...searchParams,
          ...(filters ? { filters } : {}),
        }),
      });

      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as AlgoliaSearchResponse;

      return (data.hits ?? [])
        .map((hit) => transformHit(hit, query))
        .filter((item): item is SortedResult => item !== null);
    },
  };
}
