import type { WatanukiConfig } from '@watanuki/theme/config';

export const watanukiConfig = {
  style: 'classic',
  defaultTheme: 'dark',
  toc: {
    style: 'clerk',
  },
    search: {
    provider: 'algolia',
    appId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? '',
    apiKey: process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY ?? '',
    indexName: process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME ?? '',
  },
} satisfies WatanukiConfig;
