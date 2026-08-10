import { getPageImage, source } from '@/lib/source';
import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';
import { generate as DefaultImage } from '@watanuki/ui/og';
import { appName } from '@/lib/shared';
import { isOgEnabled } from '@/lib/seo';

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<'/og/docs/[...slug]'>) {
  if (!isOgEnabled()) notFound();

  const { slug } = await params;
  const page = source.getPage(slug.slice(0, -1));
  if (!page) notFound();

  return new ImageResponse(
    <DefaultImage title={page.data.title} description={page.data.description} site={appName} />,
    {
      width: 1200,
      height: 630,
    },
  );
}

export function generateStaticParams() {
  if (!isOgEnabled()) return [];

  return source.getPages().map((page) => ({
    slug: getPageImage(page).segments,
  }));
}
