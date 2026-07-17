import { blogSource } from '@/lib/source';
import { rss } from '@watanuki/core/source/rss';
import { appName, siteUrl } from '@/lib/shared';
import { isRssEnabled } from '@/lib/seo';
import { notFound } from 'next/navigation';

export const revalidate = false;

export function GET() {
  if (!isRssEnabled('blog')) notFound();

  const items = blogSource.getPages().map((page) => {
    const data = page.data as {
      title: string;
      description?: string;
      date?: string;
      author?: string;
    };

    return {
      title: data.title,
      description: data.description,
      url: page.url,
      date: data.date,
      author: data.author,
    };
  });

  const xml = rss({
    siteUrl,
    title: `${appName} Blog`,
    description: `Posts from ${appName}`,
    items,
  }).xml();

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}
