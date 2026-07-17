import { source } from '@/lib/source';
import { exportSearchIndexes } from '@watanuki/core/search/server';

export async function exportDocsSearchIndexes() {
  return exportSearchIndexes(source, {
    language: 'english',
    localeMap: {
      // Orama has no Japanese stemmer — keep separate indexes, use English tokenization.
      ja: { language: 'english' },
    },
  });
}
