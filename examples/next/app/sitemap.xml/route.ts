import { source } from '@/lib/source';
import { siteUrl } from '@/lib/shared';
import { sitemap } from '@watanuki/core/source/sitemap';

export const revalidate = false;

export function GET() {
  const xml = sitemap(source, { siteUrl }).xml();

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
