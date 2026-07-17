import { getPageImage, getPageMarkdownUrl, source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  PagePagerButtons,
  ViewOptionsPopover,
} from '@watanuki/ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import type { Metadata } from 'next';
import { createRelativeLink } from '@watanuki/ui/mdx';
import { gitConfig } from '@/lib/shared';
import { watanukiConfig } from '@/lib/watanuki.config';
import { appName, siteUrl } from '@/lib/shared';
import { createDocsJsonLd, createDocsMetadata } from '@watanuki/ui/metadata';

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = getPageMarkdownUrl(page).url;
  const image = getPageImage(page).url;
  const jsonLd = createDocsJsonLd({
    title: page.data.title,
    description: page.data.description,
    path: page.url,
    image,
    baseUrl: siteUrl,
  });

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      tableOfContent={{ style: watanukiConfig.toc?.style }}
      tableOfContentPopover={{ style: watanukiConfig.toc?.style }}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
      <div className="flex flex-row flex-wrap gap-2 items-center border-b pb-6">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover
          markdownUrl={markdownUrl}
          githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${page.path}`}
        />
        <PagePagerButtons className="ms-auto" />
      </div>
      <DocsBody>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps<'/docs/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return createDocsMetadata({
    title: page.data.title,
    description: page.data.description,
    path: page.url,
    image: getPageImage(page).url,
    baseUrl: siteUrl,
    siteName: appName,
  });
}
