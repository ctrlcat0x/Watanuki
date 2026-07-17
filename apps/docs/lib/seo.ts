import { watanukiConfig } from '@/lib/watanuki.config';
import type { WatanukiRssType } from '@watanuki/theme/config';

const seo = watanukiConfig.seo;

export function isOgEnabled(): boolean {
  return seo?.og?.enabled !== false;
}

export function isSitemapEnabled(): boolean {
  return seo?.sitemap !== false;
}

export function isRobotsEnabled(): boolean {
  return seo?.robots !== false;
}

export function isStructuredDataEnabled(): boolean {
  return seo?.structuredData !== false;
}

export function isLlmsEnabled(): boolean {
  return seo?.llms !== false;
}

export function isRssEnabled(type?: WatanukiRssType): boolean {
  if (seo?.rss?.enabled === false) return false;
  if (!type) return seo?.rss?.enabled !== false;
  const types = seo?.rss?.types ?? ['blog'];
  return types.includes(type);
}

export function getTwitterHandle(): string | undefined {
  return seo?.x?.handle;
}
