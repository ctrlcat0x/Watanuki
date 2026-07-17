import { type DependencyList, useMemo, useRef, useState } from 'react';
import { useDebounce } from '@/utils/use-debounce';
import { type FetchOptions } from '@/search/client/fetch';
import type { AlgoliaOptions } from '@/search/client/algolia';
import type { StaticOptions } from '@/search/client/orama-static';
import type { OramaCloudOptions } from '@/search/client/orama-cloud';
import type { SortedResult } from '@/search';
import type { Awaitable } from '@/types';
import { isEqualShallow } from '@/utils/is-equal';

interface UseDocsSearch {
  search: string;
  setSearch: (v: string) => void;
  query: {
    isLoading: boolean;
    data?: SortedResult[] | 'empty';
    error?: Error;
  };
}

export type ClientPreset =
  | ({
      type: 'fetch';
    } & FetchOptions)
  | ({
      type: 'algolia';
    } & AlgoliaOptions)
  | ({
      type: 'orama-cloud';
    } & OramaCloudOptions)
  | ({
      type: 'static';
    } & StaticOptions)
  | {
      client: SearchClient;
    };

export interface SearchClient {
  search: (query: string) => Awaitable<SortedResult[]>;
  deps?: DependencyList;
}

export function useDocsSearch(
  clientOptions: ClientPreset & {
    delayMs?: number;
    allowEmpty?: boolean;
  },
  customDeps?: DependencyList,
): UseDocsSearch {
  const { delayMs = 100, allowEmpty = false, ...clientRest } = clientOptions;
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<SortedResult[] | 'empty'>('empty');
  const [error, setError] = useState<Error>();
  const [isLoading, setIsLoading] = useState(false);
  const debouncedValue = useDebounce(search, delayMs);

  let client: SearchClient | Promise<SearchClient>;

  if ('type' in clientRest) {
    switch (clientRest.type) {
      case 'fetch': {
        client = import('./client/fetch').then((mod) => mod.fetchClient(clientRest));
        break;
      }
      case 'algolia': {
        client = import('./client/algolia').then((mod) => mod.algoliaClient(clientRest));
        break;
      }
      case 'orama-cloud': {
        client = import('./client/orama-cloud').then((mod) => mod.oramaCloudClient(clientRest));
        break;
      }
      case 'static': {
        client = import('./client/orama-static').then((mod) => mod.oramaStaticClient(clientRest));
        break;
      }
      default:
        throw new Error('unknown search client');
    }
  } else {
    client = clientRest.client;
  }

  const deps: DependencyList = [
    customDeps ??
      (client instanceof Promise ? JSON.stringify(clientRest) : client.deps),
    debouncedValue,
  ];
  const [activeDeps, setActiveDeps] = useState<DependencyList | null>(null);
  const activeTaskRef = useRef<{
    deps: DependencyList;
    start: () => void;
    interrupt: boolean;
  } | null>(null);

  if (
    !isEqualShallow(activeDeps, deps) &&
    (!activeTaskRef.current || !isEqualShallow(activeTaskRef.current.deps, deps))
  ) {
    if (activeTaskRef.current) activeTaskRef.current.interrupt = true;

    activeTaskRef.current = {
      deps,
      interrupt: false,
      async start() {
        try {
          setIsLoading(true);

          let res: SortedResult[] | 'empty';
          if (debouncedValue.length === 0 && !allowEmpty) res = 'empty';
          else res = await (await client).search(debouncedValue);

          if (!this.interrupt) {
            setActiveDeps(deps);
            setError(undefined);
            setResults(res);
          }
        } catch (err) {
          if (!this.interrupt) setError(err as Error);
        } finally {
          if (!this.interrupt) setIsLoading(false);
        }
      },
    };
    void activeTaskRef.current.start();
  }

  return useMemo(
    () => ({ search, setSearch, query: { isLoading, data: results, error } }),
    [search, isLoading, results, error],
  );
}

export type { AlgoliaOptions, FetchOptions, OramaCloudOptions, StaticOptions };
