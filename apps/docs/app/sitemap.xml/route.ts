import { source } from '@/lib/source';
import { sitemap } from '@watanuki/core/source/sitemap';
import { siteUrl } from '@/lib/shared';
import { isSitemapEnabled } from '@/lib/seo';
import { notFound } from 'next/navigation';

export const revalidate = false;

export function GET() {
  if (!isSitemapEnabled()) notFound();

  const xml = sitemap(source, { siteUrl }).xml();

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
