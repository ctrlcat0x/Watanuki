import { describe, expect, test } from 'vitest';
import { createDocsMetadata } from '../src/metadata.ts';

describe('createDocsMetadata', () => {
  test('emits canonical and share-image metadata', () => {
    const metadata = createDocsMetadata({
      title: 'Getting Started',
      description: 'Build your first docs page.',
      path: '/docs/getting-started',
      image: '/og/docs/getting-started/image.png',
      baseUrl: 'https://docs.example.com',
      siteName: 'Example Docs',
      twitterHandle: 'example',
    });

    expect(metadata.alternates?.canonical).toBe(
      'https://docs.example.com/docs/getting-started',
    );
    expect(metadata.openGraph?.images).toEqual([
      {
        url: 'https://docs.example.com/og/docs/getting-started/image.png',
        width: 1200,
        height: 630,
        alt: 'Getting Started',
      },
    ]);
    expect(metadata.twitter).toMatchObject({
      card: 'summary_large_image',
      creator: '@example',
      site: '@example',
      images: ['https://docs.example.com/og/docs/getting-started/image.png'],
    });
  });
});
