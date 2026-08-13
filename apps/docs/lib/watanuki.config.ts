import type { WatanukiConfig } from '@watanuki/theme/config';

/** Structural style — change here, not in UI */
export const watanukiConfig = {
  style: 'classic',
  defaultTheme: 'dark',
  toc: {
    style: 'tab',
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
    rss: { enabled: true, types: ['blog'] },
    sitemap: true,
    robots: true,
    structuredData: true,
    llms: true,
    x: { handle: '@watanuki' },
  },
} satisfies WatanukiConfig;
