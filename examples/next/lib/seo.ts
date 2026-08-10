import { watanukiConfig } from '@/lib/watanuki.config';
import type { WatanukiSeoConfig } from '@watanuki/theme/config';

const seo: WatanukiSeoConfig | undefined = watanukiConfig.seo;

export function isOgEnabled(): boolean {
  return seo?.og?.enabled !== false;
}

export function isStructuredDataEnabled(): boolean {
  return seo?.structuredData !== false;
}

export function isSitemapEnabled(): boolean {
  return seo?.sitemap !== false;
}

export function isRobotsEnabled(): boolean {
  return seo?.robots !== false;
}

export function isLlmsEnabled(): boolean {
  return seo?.llms !== false;
}

export function getTwitterHandle(): string | undefined {
  return seo?.x?.handle;
}
