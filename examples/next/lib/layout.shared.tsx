import type { BaseLayoutProps } from '@watanuki/ui/layouts/shared';
import { WatanukiThemeSwitch } from '@watanuki/theme/react';
import { appName, gitConfig } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      // JSX supported
      title: appName,
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    slots: {
      themeSwitch: WatanukiThemeSwitch,
    },
  };
}
