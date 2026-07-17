import { blogSource } from '@/lib/source';
import { getMDXComponents } from '@/components/mdx';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createBlogJsonLd, createBlogMetadata } from '@watanuki/ui/metadata';
import { appName, siteUrl } from '@/lib/shared';
import { getTwitterHandle, isStructuredDataEnabled } from '@/lib/seo';

export default async function BlogPost(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params;
  const page = blogSource.getPage([slug]);
  if (!page) notFound();

  const MDX = page.data.body;
  const data = page.data as {
    title: string;
    description?: string;
    date?: string;
    author?: string;
  };
  const jsonLd = isStructuredDataEnabled()
    ? createBlogJsonLd({
        title: data.title,
        description: data.description,
        path: page.url,
        baseUrl: siteUrl,
        date: data.date,
        author: data.author,
      })
    : null;

  return (
    <main className="container mx-auto max-w-3xl py-16 prose">
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
      <h1>{data.title}</h1>
      {data.description ? <p className="text-fd-muted-foreground">{data.description}</p> : null}
      <MDX components={getMDXComponents()} />
    </main>
  );
}

export function generateStaticParams() {
  return blogSource.getPages().map((page) => ({
    slug: page.slugs.at(-1)!,
  }));
}

export async function generateMetadata(
  props: PageProps<'/blog/[slug]'>,
): Promise<Metadata> {
  const { slug } = await props.params;
  const page = blogSource.getPage([slug]);
  if (!page) notFound();

  const data = page.data as {
    title: string;
    description?: string;
    date?: string;
    author?: string;
  };

  return createBlogMetadata({
    title: data.title,
    description: data.description,
    path: page.url,
    baseUrl: siteUrl,
    siteName: appName,
    twitterHandle: getTwitterHandle(),
    date: data.date,
    author: data.author,
  });
}
