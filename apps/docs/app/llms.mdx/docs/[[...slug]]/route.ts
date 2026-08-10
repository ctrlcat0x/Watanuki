import { getLLMText, getPageMarkdownUrl, source } from '@/lib/source';
import { notFound } from 'next/navigation';
import { i18n } from '@/lib/i18n';

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<'/llms.mdx/docs/[[...slug]]'>) {
  const { slug } = await params;
  const [localeSegment, ...localizedSlug] = slug ?? [];
  const locale = i18n.languages.includes(localeSegment as (typeof i18n.languages)[number])
    ? localeSegment
    : undefined;
  const page = source.getPage((locale ? localizedSlug : slug)?.slice(0, -1), locale);
  if (!page) notFound();

  return new Response(await getLLMText(page), {
    headers: {
      'Content-Type': 'text/markdown',
    },
  });
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    slug: getPageMarkdownUrl(page).segments,
  }));
}
