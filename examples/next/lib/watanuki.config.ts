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
  // Uses LFM2-350M locally in the browser through WebGPU.
  ai: {
    enabled: true,
  },
  seo: {
    og: { enabled: true },
    sitemap: true,
    robots: true,
    structuredData: true,
    llms: true,
  },
} satisfies WatanukiConfig;
