export interface RssItem {
  title: string;
  description?: string;
  /**
   * Absolute URL, or path relative to `siteUrl`
   */
  url: string;
  date?: Date | string;
  author?: string;
}

export interface RssConfig {
  /**
   * Absolute site origin, e.g. `https://watanuki.dev`
   */
  siteUrl: string;
  title: string;
  description?: string;
  language?: string;
  items: RssItem[];
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function toAbsoluteUrl(siteUrl: string, path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const origin = siteUrl.replace(/\/$/, '');
  const pathname = path.startsWith('/') ? path : `/${path}`;
  return `${origin}${pathname}`;
}

function formatRfc822(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  return date.toUTCString();
}

/**
 * Generate an RSS 2.0 feed.
 */
export function rss(config: RssConfig) {
  const { siteUrl, title, description, language = 'en', items } = config;
  const channelLink = toAbsoluteUrl(siteUrl, '/');

  function xml(): string {
    const itemXml = items.map((item) => {
      const link = toAbsoluteUrl(siteUrl, item.url);
      const lines = [
        '    <item>',
        `      <title>${escapeXml(item.title)}</title>`,
        `      <link>${escapeXml(link)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
      ];

      if (item.description) {
        lines.push(`      <description>${escapeXml(item.description)}</description>`);
      }
      if (item.date) {
        lines.push(`      <pubDate>${escapeXml(formatRfc822(item.date))}</pubDate>`);
      }
      if (item.author) {
        lines.push(`      <author>${escapeXml(item.author)}</author>`);
      }

      lines.push('    </item>');
      return lines.join('\n');
    });

    return [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<rss version="2.0">',
      '  <channel>',
      `    <title>${escapeXml(title)}</title>`,
      `    <link>${escapeXml(channelLink)}</link>`,
      description
        ? `    <description>${escapeXml(description)}</description>`
        : '    <description></description>',
      `    <language>${escapeXml(language)}</language>`,
      ...itemXml,
      '  </channel>',
      '</rss>',
    ].join('\n');
  }

  return { xml };
}
