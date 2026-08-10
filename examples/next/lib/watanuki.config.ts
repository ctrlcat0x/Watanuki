import type { WatanukiConfig } from '@watanuki/theme/config';

export const watanukiConfig = {
  style: 'classic',
  defaultTheme: 'dark',
  toc: {
    style: 'clerk',
  },
  search: {
    provider: 'local',
  },
  seo: {
    og: { enabled: true },
    sitemap: true,
    robots: true,
    structuredData: true,
    llms: true,
  },
} satisfies WatanukiConfig;
