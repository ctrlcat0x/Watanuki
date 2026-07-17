import { source } from '@/lib/source';
import { exportSearchIndexes } from '@watanuki/core/search/server';

export async function exportSearchIndexesFromSource() {
  return exportSearchIndexes(source, {
    language: 'english',
  });
}
