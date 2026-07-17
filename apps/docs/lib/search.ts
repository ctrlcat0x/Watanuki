'use client';

import type { WatanukiSearchConfig } from '@watanuki/theme/config';
import { OramaCloud } from '@orama/core';
import AlgoliaSearchDialog from '@watanuki/ui/components/dialog/search-algolia';
import CommandSearchDialog from '@watanuki/ui/components/dialog/search-command';
import OramaSearchDialog from '@watanuki/ui/components/dialog/search-orama';

export function resolveSearchDialog(config?: WatanukiSearchConfig) {
  switch (config?.provider ?? 'local') {
    case 'algolia':
      return AlgoliaSearchDialog;
    case 'orama':
      return OramaSearchDialog;
    case 'local':
    default:
      return CommandSearchDialog;
  }
}

export function resolveSearchOptions(config?: WatanukiSearchConfig) {
  if (config?.provider === 'algolia') {
    return {
      searchOptions: {
        appId: config.appId,
        apiKey: config.apiKey,
        indexName: config.indexName,
        searchParams: config.searchParams,
      },
    };
  }

  if (config?.provider === 'orama') {
    return {
      client: new OramaCloud({
        projectId: config.projectId,
        apiKey: config.apiKey,
      }),
      index: config.index,
      searchOptions: config.params,
    };
  }

  // local — client-side fuzzy over the static index
  return {
    type: 'static' as const,
    api: config && 'api' in config && config.api ? config.api : '/static.json',
  };
}
