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
} satisfies WatanukiConfig;
