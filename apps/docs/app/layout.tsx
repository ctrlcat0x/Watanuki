import './global.css';
import { Inter } from 'next/font/google';
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
const websiteJsonLd = isStructuredDataEnabled()
  ? createWebsiteJsonLd({
      name: appName,
      description: 'Documentation framework for Next.js',
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
