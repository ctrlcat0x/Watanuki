import { robots } from '@watanuki/core/source/robots';
import { siteUrl } from '@/lib/shared';
import { isRobotsEnabled, isSitemapEnabled } from '@/lib/seo';
import { notFound } from 'next/navigation';

export const revalidate = false;

export function GET() {
  if (!isRobotsEnabled()) notFound();

  const body = robots({
    siteUrl,
    sitemap: isSitemapEnabled(),
  }).text();

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
