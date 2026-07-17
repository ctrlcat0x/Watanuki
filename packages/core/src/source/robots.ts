export interface RobotsConfig {
  /**
   * Absolute site origin, e.g. `https://watanuki.dev`
   */
  siteUrl: string;
  /**
   * Paths to allow. Default: `['/']`
   */
  allow?: string[];
  /**
   * Paths to disallow.
   */
  disallow?: string[];
  /**
   * Include a Sitemap directive. Pass `true` for `${siteUrl}/sitemap.xml`,
   * or an absolute/relative sitemap URL.
   * @defaultValue true
   */
  sitemap?: boolean | string;
}

function toAbsoluteUrl(siteUrl: string, path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const origin = siteUrl.replace(/\/$/, '');
  const pathname = path.startsWith('/') ? path : `/${path}`;
  return `${origin}${pathname}`;
}

/**
 * Generate `robots.txt` body.
 */
export function robots(config: RobotsConfig) {
  const { siteUrl, allow = ['/'], disallow = [], sitemap: sitemapOpt = true } = config;

  function text(): string {
    const lines = ['User-agent: *'];

    for (const path of allow) {
      lines.push(`Allow: ${path}`);
    }
    for (const path of disallow) {
      lines.push(`Disallow: ${path}`);
    }

    if (sitemapOpt !== false) {
      const sitemapUrl =
        typeof sitemapOpt === 'string'
          ? toAbsoluteUrl(siteUrl, sitemapOpt)
          : toAbsoluteUrl(siteUrl, '/sitemap.xml');
      lines.push('', `Sitemap: ${sitemapUrl}`);
    }

    return `${lines.join('\n')}\n`;
  }

  return { text };
}
