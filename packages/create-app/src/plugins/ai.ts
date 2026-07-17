import { TemplatePlugin } from '@/index';

/**
 * AI scaffolding is disabled until `@watanuki/cli` is published.
 */
export function ai(_provider: 'openrouter' | 'llmgateway' | 'inkeep'): TemplatePlugin {
  return {
    async afterWrite() {
      console.warn(
        'AI plugin is not available yet — @watanuki/cli is not published. Skipping AI setup.',
      );
    },
  };
}
