import type { WatanukiConfig } from '@watanuki/theme/config';

export const watanukiConfig = {
  style: 'classic',
  defaultTheme: 'dark',
  toc: {
    style: 'clerk',
  },
    search: {
    provider: 'orama',
    projectId: import.meta.env.VITE_ORAMA_PROJECT_ID ?? '',
    apiKey: import.meta.env.VITE_ORAMA_PUBLIC_API_KEY ?? '',
    index: import.meta.env.VITE_ORAMA_INDEX ?? 'docs',
  },
} satisfies WatanukiConfig;
