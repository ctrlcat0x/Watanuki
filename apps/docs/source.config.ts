import { defineCollections, defineConfig, defineDocs } from '@watanuki/mdx/config';
import { metaSchema, pageSchema } from '@watanuki/core/source/schema';
import { z } from 'zod';

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

export const blog = defineCollections({
  type: 'doc',
  dir: 'content/blog',
  schema: pageSchema.extend({
    date: z.string().date().or(z.string()),
    author: z.string().optional(),
  }),
});

export default defineConfig({
  mdxOptions: {
    // Ensure mermaid fences become <Mermaid /> (default, but pin explicitly)
    remarkMdxMermaidOptions: {},
    // Persist package-manager code tabs so they sync with <Tabs groupId="package-manager">
    remarkNpmOptions: {
      persist: { id: 'package-manager' },
    },
    // Opt-in KaTeX math
    remarkMathOptions: {},
    rehypeKatexOptions: {},
  },
});
