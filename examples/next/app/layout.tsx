import { DocsRootProvider } from '@/components/docs-root-provider';
import './global.css';
import { Inter } from 'next/font/google';
import { watanukiConfig } from '@/lib/watanuki.config';
import { getThemeInitScript, isDarkTheme } from '@watanuki/theme';
import { cn } from '@/lib/cn';
import type { Metadata } from 'next';
import { appName, siteUrl } from '@/lib/shared';

const inter = Inter({ subsets: ['latin'] });
const defaultTheme = watanukiConfig.defaultTheme ?? 'dark';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: appName,
  title: {
    default: appName,
    template: `%s | ${appName}`,
  },
  description: `Documentation site built with ${appName}`,
  openGraph: {
    type: 'website',
    siteName: appName,
    url: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      data-watanuki-style={watanukiConfig.style}
      data-watanuki-theme={defaultTheme}
      className={cn(inter.className, isDarkTheme(defaultTheme) && 'dark')}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: getThemeInitScript(defaultTheme),
          }}
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <DocsRootProvider>{children}</DocsRootProvider>
      </body>
    </html>
  );
}
