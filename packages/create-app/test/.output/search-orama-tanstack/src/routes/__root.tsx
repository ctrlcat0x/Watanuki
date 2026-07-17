import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import * as React from 'react';
import appCss from '@/styles/app.css?url';
import { DocsRootProvider } from '@/components/docs-root-provider';
import { watanukiConfig } from '@/lib/watanuki.config';
import { getThemeInitScript, isDarkTheme } from '@watanuki/theme';
import { cn } from '@/lib/cn';

const defaultTheme = watanukiConfig.defaultTheme ?? 'dark';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Watanuki on TanStack Start' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
    scripts: [
      {
        children: getThemeInitScript(defaultTheme),
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <html
      lang="en"
      data-watanuki-style={watanukiConfig.style}
      data-watanuki-theme={defaultTheme}
      className={cn(isDarkTheme(defaultTheme) && 'dark')}
      suppressHydrationWarning
    >
      <head>
        <HeadContent />
      </head>
      <body className="flex flex-col min-h-screen">
        <DocsRootProvider>
          <Outlet />
        </DocsRootProvider>
        <Scripts />
      </body>
    </html>
  );
}
