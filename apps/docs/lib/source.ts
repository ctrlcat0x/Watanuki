import { blog, docs } from 'collections/server';
import { loader } from '@watanuki/core/source';
import { lucideIconsPlugin } from '@watanuki/core/source/lucide-icons';
import { toWatanukiSource } from '@watanuki/mdx/runtime/server';
import { i18n } from './i18n';
import { openapi } from './openapi';
import { docsContentRoute, docsImageRoute, docsRoute } from './shared';

export const source = loader(
  {
    docs: docs.toWatanukiSource(),
    openapi: await openapi.staticSource({ groupBy: 'tag' }),
  },
  {
    baseUrl: docsRoute,
    i18n,
    plugins: [lucideIconsPlugin(), openapi.loaderPlugin()],
  },
);

export const blogSource = loader({
  baseUrl: '/blog',
  source: toWatanukiSource(blog, []),
});

export function getPageImage(page: (typeof source)['$inferPage']) {
  const segments = [...page.slugs, 'image.png'];

  return {
    segments,
    url: `${docsImageRoute}/${segments.join('/')}`,
  };
}

export function getPageMarkdownUrl(page: (typeof source)['$inferPage']) {
  const segments = [...page.slugs, 'content.md'];

  return {
    segments,
    url: `${docsContentRoute}/${segments.join('/')}`,
  };
}

export async function getLLMText(page: (typeof source)['$inferPage']) {
  if (page.type === 'openapi' || !('getText' in page.data)) {
    return `# ${page.data.title} (${page.url})\n\n${page.data.description ?? ''}`;
  }

  const processed = await page.data.getText('processed');

  return `# ${page.data.title} (${page.url})

${processed}`;
}
