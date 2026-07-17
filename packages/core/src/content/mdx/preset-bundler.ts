import type { ProcessorOptions } from '@mdx-js/mdx';
import type * as Plugins from '@/mdx-plugins';
import { resolvePlugins, type ResolvePlugins } from '@/content/mdx/util';
import type { Pluggable } from 'unified';

export type MDXBundlerPresetOptions = Omit<
  NonNullable<ProcessorOptions>,
  'rehypePlugins' | 'remarkPlugins'
> & {
  rehypePlugins?: ResolvePlugins;
  remarkPlugins?: ResolvePlugins;

  /** @private for `remark-include` */
  _include?: Pluggable;
  remarkStructureOptions?: Plugins.StructureOptions | false;
  remarkHeadingOptions?: Plugins.RemarkHeadingOptions | false;
  remarkImageOptions?: Plugins.RemarkImageOptions | false;
  remarkCodeTabOptions?: Plugins.RemarkCodeTabOptions | false;
  remarkNpmOptions?: Plugins.RemarkNpmOptions | false;
  remarkMdxMermaidOptions?: Plugins.RemarkMdxMermaidOptions | false;
  /** Opt-in KaTeX math. Pass `{}` or options to enable. */
  remarkMathOptions?: Record<string, unknown> | false;
  /** Opt-in companion for `remarkMathOptions`. */
  rehypeKatexOptions?: Record<string, unknown> | false;
  rehypeCodeOptions?: Plugins.RehypeCodeOptions | false;
};

/**
 * apply MDX processor presets
 */
export async function mdxPreset(options: MDXBundlerPresetOptions = {}): Promise<ProcessorOptions> {
  const {
    rehypeCodeOptions,
    remarkImageOptions,
    remarkHeadingOptions,
    remarkStructureOptions,
    remarkCodeTabOptions,
    remarkNpmOptions,
    remarkMdxMermaidOptions,
    remarkMathOptions,
    rehypeKatexOptions,
    _include,
    ...mdxOptions
  } = options;

  const remarkPlugins = await resolvePlugins(
    (v) => [
      import('remark-gfm').then((mod) => mod.default),
      remarkHeadingOptions !== false &&
        import('@/mdx-plugins/remark-heading').then((mod) => [
          mod.remarkHeading,
          {
            generateToc: false,
            ...remarkHeadingOptions,
          },
        ]),
      _include ?? false,
      remarkImageOptions !== false &&
        import('@/mdx-plugins/remark-image').then((mod) => [
          mod.remarkImage,
          {
            ...remarkImageOptions,
            useImport: remarkImageOptions?.useImport ?? true,
          },
        ]),
      remarkCodeTabOptions !== false &&
        import('@/mdx-plugins/remark-code-tab').then((mod) => [
          mod.remarkCodeTab,
          remarkCodeTabOptions,
        ]),
      remarkNpmOptions !== false &&
        import('@/mdx-plugins/remark-npm').then((mod) => [mod.remarkNpm, remarkNpmOptions]),
      remarkMdxMermaidOptions !== false &&
        import('@/mdx-plugins/remark-mdx-mermaid').then((mod) => [
          mod.remarkMdxMermaid,
          remarkMdxMermaidOptions,
        ]),
      remarkMathOptions != null &&
        remarkMathOptions !== false &&
        import('remark-math').then((mod) => [mod.default, remarkMathOptions]),
      ...v,
      remarkStructureOptions !== false &&
        import('@/mdx-plugins/remark-structure').then((mod) => [
          mod.remarkStructure,
          {
            exportAs: 'structuredData',
            ...remarkStructureOptions,
          } satisfies Plugins.StructureOptions,
        ]),
    ],
    mdxOptions.remarkPlugins,
  );

  const rehypePlugins = await resolvePlugins(
    (v) => [
      // KaTeX before Shiki — remark-math emits language-math code blocks
      rehypeKatexOptions != null &&
        rehypeKatexOptions !== false &&
        import('rehype-katex').then((mod) => [mod.default, rehypeKatexOptions]),
      rehypeCodeOptions !== false &&
        import('@/mdx-plugins/rehype-code').then((mod) => [mod.rehypeCode, rehypeCodeOptions]),
      ...v,
      import('@/mdx-plugins/rehype-toc').then((mod) => mod.rehypeToc),
    ],
    mdxOptions.rehypePlugins,
  );

  return {
    ...mdxOptions,
    remarkPlugins,
    rehypePlugins,
  };
}
