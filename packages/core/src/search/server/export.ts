import type { LoaderConfig, LoaderOutput } from '@/source/loader';
import {
  createFromSource,
  type CreateFromSourceOptions,
} from '@/search/orama/create-server';

/**
 * Export Orama search indexes for static client-side search.
 */
export async function exportSearchIndexes<C extends LoaderConfig = LoaderConfig>(
  loader: LoaderOutput<C>,
  options: CreateFromSourceOptions<C> = {},
) {
  const server = createFromSource(loader, options);
  return server.export();
}
