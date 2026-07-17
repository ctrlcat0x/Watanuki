import type { LoaderConfig, LoaderOutput } from './loader';

export interface SitemapConfig {
  /**
   * Absolute site origin, e.g. `https://watanuki.dev`
   */
  siteUrl: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  lastModified?: (page: LoaderOutput<LoaderConfig>['$inferPage']) => Date | string | undefined;
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function formatLastMod(value: Date | string): string {
  if (value instanceof Date) return value.toISOString();
  return new Date(value).toISOString();
}

function toAbsoluteUrl(siteUrl: string, path: string): string {
  const origin = siteUrl.replace(/\/$/, '');
  const pathname = path.startsWith('/') ? path : `/${path}`;
  return `${origin}${pathname}`;
}

export function sitemap<C extends LoaderConfig = LoaderConfig>(
  loader: LoaderOutput<C>,
  config: SitemapConfig,
) {
  const {
    siteUrl,
    changefreq = 'weekly',
    priority = 0.5,
    lastModified = (page) => {
      const data = page.data as { lastModified?: Date | string };
      return data.lastModified;
    },
  } = config;

  function xml(lang?: string): string {
    const pages = loader.getPages(lang);
    const urls = pages.map((page) => {
      const lastmod = lastModified(page);
      const lines = [
        '  <url>',
        `    <loc>${escapeXml(toAbsoluteUrl(siteUrl, page.url))}</loc>`,
      ];

      if (lastmod) lines.push(`    <lastmod>${escapeXml(formatLastMod(lastmod))}</lastmod>`);
      lines.push(`    <changefreq>${changefreq}</changefreq>`);
      lines.push(`    <priority>${priority}</priority>`, '  </url>');
      return lines.join('\n');
    });

    return [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...urls,
      '</urlset>',
    ].join('\n');
  }

  return { xml };
}
