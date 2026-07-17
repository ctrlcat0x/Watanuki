import type { ProcessorOptions } from '@mdx-js/mdx';
import type { Pluggable } from 'unified';
import type * as Plugins from '@watanuki/core/mdx-plugins';
import type { BuildEnvironment } from './build';

type ResolvePlugins = Pluggable[] | ((v: Pluggable[]) => Pluggable[]);

export type DefaultMDXOptions = Omit<
  NonNullable<ProcessorOptions>,
  'rehypePlugins' | 'remarkPlugins' | '_ctx'
> & {
  rehypePlugins?: ResolvePlugins;
  remarkPlugins?: ResolvePlugins;

  /**
   * Properties to export from `vfile.data`
   */
  valueToExport?: string[];

  remarkStructureOptions?: Plugins.StructureOptions | false;
  remarkHeadingOptions?: Plugins.RemarkHeadingOptions;
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

function pluginOption(
  def: (v: Pluggable[]) => (Pluggable | false)[],
  options: ResolvePlugins = [],
): Pluggable[] {
  const list = def(Array.isArray(options) ? options : []).filter(Boolean) as Pluggable[];

  if (typeof options === 'function') {
    return options(list);
  }

  return list;
}

export type MDXPresetOptions =
  | ({ preset?: 'watanuki' } & DefaultMDXOptions)
  | ({
      preset: 'minimal';
    } & ProcessorOptions);

/**
 * apply MDX processor presets
 */
export function applyMdxPreset(
  options: MDXPresetOptions = {},
): (environment: BuildEnvironment) => Promise<ProcessorOptions> {
  return async (environment = 'bundler') => {
    if (options.preset === 'minimal') return options;

    const plugins = await import('@watanuki/core/mdx-plugins');
    const {
      valueToExport = [],
      rehypeCodeOptions,
      remarkImageOptions,
      remarkHeadingOptions,
      remarkStructureOptions,
      remarkCodeTabOptions,
      remarkNpmOptions,
      remarkMdxMermaidOptions,
      remarkMathOptions,
      rehypeKatexOptions,
      ...mdxOptions
    } = options;

    const remarkMathPlugin =
      remarkMathOptions != null && remarkMathOptions !== false
        ? ([
            (await import('remark-math')).default,
            remarkMathOptions,
          ] as Pluggable)
        : false;
    const rehypeKatexPlugin =
      rehypeKatexOptions != null && rehypeKatexOptions !== false
        ? ([
            (await import('rehype-katex')).default,
            rehypeKatexOptions,
          ] as Pluggable)
        : false;

    const remarkPlugins = pluginOption(
      (v) => [
        plugins.remarkGfm,
        [
          plugins.remarkHeading,
          {
            generateToc: false,
            ...remarkHeadingOptions,
          },
        ],
        remarkImageOptions !== false && [
          plugins.remarkImage,
          {
            ...remarkImageOptions,
            useImport: remarkImageOptions?.useImport ?? environment === 'bundler',
          },
        ],
        'remarkCodeTab' in plugins &&
          remarkCodeTabOptions !== false && [plugins.remarkCodeTab, remarkCodeTabOptions],
        'remarkNpm' in plugins &&
          remarkNpmOptions !== false && [plugins.remarkNpm, remarkNpmOptions],
        // Always enable when present — do not rely on stale processor caches skipping it
        remarkMdxMermaidOptions !== false &&
          plugins.remarkMdxMermaid && [
            plugins.remarkMdxMermaid,
            remarkMdxMermaidOptions,
          ],
        remarkMathPlugin,
        ...v,
        remarkStructureOptions !== false && [
          plugins.remarkStructure,
          {
            exportAs: 'structuredData',
            ...remarkStructureOptions,
          } satisfies Plugins.StructureOptions,
        ],
        valueToExport.length > 0 &&
          (() => {
            return (_, file) => {
              file.data['mdx-export'] ??= [];

              for (const name of valueToExport) {
                if (!(name in file.data)) continue;

                file.data['mdx-export'].push({
                  name,
                  value: file.data[name],
                });
              }
            };
          }),
      ],
      mdxOptions.remarkPlugins,
    );

    const rehypePlugins = pluginOption(
      (v) => [
        // KaTeX before Shiki — remark-math emits language-math code blocks
        rehypeKatexPlugin,
        rehypeCodeOptions !== false && [plugins.rehypeCode, rehypeCodeOptions],
        ...v,
        plugins.rehypeToc,
      ],
      mdxOptions.rehypePlugins,
    );

    return {
      ...mdxOptions,
      outputFormat: environment === 'runtime' ? 'function-body' : mdxOptions.outputFormat,
      remarkPlugins,
      rehypePlugins,
    };
  };
}
