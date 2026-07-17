import { source } from '@/lib/source';
import { sitemap } from '@watanuki/core/source/sitemap';

export const revalidate = false;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com';

export function GET() {
  const xml = sitemap(source, { siteUrl }).xml();

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
