import type { Metadata } from 'next';

export interface DocsMetadataOptions {
  title: string;
  description?: string;
  path: string;
  image?: string;
  baseUrl: string;
  siteName: string;
  /** X / Twitter handle, e.g. `@acme` */
  twitterHandle?: string;
}

function toAbsoluteUrl(baseUrl: string, path: string): string {
  return new URL(path, baseUrl).toString();
}

function normalizeHandle(handle?: string): string | undefined {
  if (!handle) return undefined;
  return handle.startsWith('@') ? handle : `@${handle}`;
}

export function createDocsMetadata({
  title,
  description,
  path,
  image,
  baseUrl,
  siteName,
  twitterHandle,
}: DocsMetadataOptions): Metadata {
  const canonical = toAbsoluteUrl(baseUrl, path);
  const ogImage = image ? toAbsoluteUrl(baseUrl, image) : undefined;
  const handle = normalizeHandle(twitterHandle);

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: 'article',
      url: canonical,
      title,
      description,
      siteName,
      images: ogImage ? [ogImage] : undefined,
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
      creator: handle,
      site: handle,
    },
  };
}

export function createDocsJsonLd({
  title,
  description,
  path,
  image,
  baseUrl,
}: Omit<DocsMetadataOptions, 'siteName' | 'twitterHandle'>) {
  const url = toAbsoluteUrl(baseUrl, path);

  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    description,
    url,
    image: image ? [toAbsoluteUrl(baseUrl, image)] : undefined,
  };
}

export interface BlogMetadataOptions extends DocsMetadataOptions {
  date?: string | Date;
  author?: string;
}

export function createBlogMetadata(options: BlogMetadataOptions): Metadata {
  const meta = createDocsMetadata(options);
  const published =
    options.date instanceof Date
      ? options.date.toISOString()
      : options.date
        ? new Date(options.date).toISOString()
        : undefined;

  return {
    ...meta,
    openGraph: {
      ...meta.openGraph,
      type: 'article',
      publishedTime: published,
      authors: options.author ? [options.author] : undefined,
    },
  };
}

export function createBlogJsonLd({
  title,
  description,
  path,
  image,
  baseUrl,
  date,
  author,
}: Omit<BlogMetadataOptions, 'siteName' | 'twitterHandle'>) {
  const url = toAbsoluteUrl(baseUrl, path);

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    url,
    image: image ? [toAbsoluteUrl(baseUrl, image)] : undefined,
    datePublished:
      date instanceof Date ? date.toISOString() : date ? new Date(date).toISOString() : undefined,
    author: author
      ? {
          '@type': 'Person',
          name: author,
        }
      : undefined,
  };
}

export function createWebsiteJsonLd({
  name,
  description,
  baseUrl,
}: {
  name: string;
  description?: string;
  baseUrl: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    description,
    url: baseUrl,
  };
}
