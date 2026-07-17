import { createRequire } from 'node:module';
import { configDefaults, defineProject } from 'vitest/config';

const require = createRequire(import.meta.url);

const hasSatteri = (() => {
  try {
    require.resolve('@watanuki/satteri/preset');
    return true;
  } catch {
    return false;
  }
})();

export default defineProject({
  resolve: {
    alias: {
      '@/': new URL('./src/', import.meta.url).pathname,
    },
  },
  test: {
    exclude: [
      ...configDefaults.exclude,
      ...(hasSatteri ? [] : ['test/satteri.test.ts', 'test/satteri-toc-count.test.ts']),
    ],
  },
});
