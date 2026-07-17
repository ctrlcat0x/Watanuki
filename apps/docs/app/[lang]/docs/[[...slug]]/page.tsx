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
import { appName, gitConfig, siteUrl } from '@/lib/shared';
import { OpenAPIPage } from '@/components/api-page';
import { createDocsJsonLd, createDocsMetadata } from '@watanuki/ui/metadata';
import { watanukiConfig } from '@/lib/watanuki.config';
import { getTwitterHandle, isOgEnabled, isStructuredDataEnabled } from '@/lib/seo';

export default async function Page(props: {
  params: Promise<{ lang: string; slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug, params.lang);
  if (!page) notFound();

  if (page.type === 'openapi') {
    return (
      <DocsPage
        toc={page.data.toc}
        full
        tableOfContent={{ style: watanukiConfig.toc?.style }}
        tableOfContentPopover={{ style: watanukiConfig.toc?.style }}
      >
        <DocsTitle>{page.data.title}</DocsTitle>
        <DocsDescription>{page.data.description}</DocsDescription>
        <DocsBody>
          <OpenAPIPage {...page.data.getOpenAPIPageProps()} />
        </DocsBody>
      </DocsPage>
    );
  }

  const MDX = page.data.body;
  const markdownUrl = getPageMarkdownUrl(page).url;
  const jsonLd = isStructuredDataEnabled()
    ? createDocsJsonLd({
        title: page.data.title,
        description: page.data.description,
        path: page.url,
        image: isOgEnabled() ? getPageImage(page).url : undefined,
        baseUrl: siteUrl,
      })
    : null;

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
        {jsonLd ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        ) : null}
        <MDX
          components={getMDXComponents({
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

export async function generateMetadata(props: {
  params: Promise<{ lang: string; slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug, params.lang);
  if (!page) notFound();

  return createDocsMetadata({
    title: page.data.title ?? 'Untitled',
    description: page.data.description,
    path: page.url,
    image: isOgEnabled() ? getPageImage(page).url : undefined,
    baseUrl: siteUrl,
    siteName: appName,
    twitterHandle: getTwitterHandle(),
  });
}
