import { defineConfig, defineDocs } from '@watanuki/mdx/config';
import { metaSchema, pageSchema } from '@watanuki/core/source/schema';

// You can customize Zod schemas for frontmatter and `meta.json` here
// see https://watanuki.dev/docs/mdx/collections
export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  mdxOptions: {
    // MDX options
  },
});
