import './global.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { watanukiConfig } from '@/lib/watanuki.config';
import { DocsRootProvider } from '@/components/docs-root-provider';
import { getThemeInitScript, isDarkTheme } from '@watanuki/theme';
import { cn } from '@/lib/cn';
import { i18n } from '@/lib/i18n';
import { createWebsiteJsonLd } from '@watanuki/ui/metadata';
import { appName, siteUrl } from '@/lib/shared';
import { isStructuredDataEnabled } from '@/lib/seo';

const inter = Inter({
  subsets: ['latin'],
});

const defaultTheme = watanukiConfig.defaultTheme ?? 'dark';
const description = 'Documentation framework for Next.js';
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: appName,
  title: {
    default: appName,
    template: `%s | ${appName}`,
  },
  description,
  icons: {
    icon: '/icon.png',
  },
  openGraph: {
    type: 'website',
    siteName: appName,
    url: '/',
    title: appName,
    description,
  },
  twitter: {
    card: 'summary',
    title: appName,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const websiteJsonLd = isStructuredDataEnabled()
  ? createWebsiteJsonLd({
      name: appName,
      description,
      baseUrl: siteUrl,
    })
  : null;

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang={i18n.defaultLanguage}
      data-watanuki-style={watanukiConfig.style}
      data-watanuki-theme={defaultTheme}
      className={cn(inter.className, isDarkTheme(defaultTheme) && 'dark')}
      suppressHydrationWarning
    >
      <head>
        <script
          id="watanuki-theme-init"
          dangerouslySetInnerHTML={{
            __html: getThemeInitScript(defaultTheme),
          }}
        />
        {websiteJsonLd ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
          />
        ) : null}
      </head>
      <body className="flex flex-col min-h-screen">
        <DocsRootProvider>{children}</DocsRootProvider>
      </body>
    </html>
  );
}
