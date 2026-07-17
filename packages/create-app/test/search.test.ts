import { expect, test } from 'vitest';
import path from 'node:path';
import fs from 'node:fs/promises';
import { create } from '@/index';
import { search } from '@/plugins/search';
import { staticSearch } from '@/plugins/static-search';

test('local search scaffolds static index and removes api search (next)', async () => {
  const tmp = path.join(import.meta.dirname, './.output/search-local-next');
  await create({
    outputDir: tmp,
    template: 'next',
    plugins: [staticSearch()],
  });

  await expect(fs.access(path.join(tmp, 'app/static.json/route.ts'))).resolves.toBeUndefined();
  await expect(fs.access(path.join(tmp, 'app/api/search/route.ts'))).rejects.toThrow();
  await expect(fs.access(path.join(tmp, 'lib/export-search-indexes.ts'))).resolves.toBeUndefined();

  const config = await fs.readFile(path.join(tmp, 'lib/watanuki.config.ts'), 'utf-8');
  expect(config).toContain("provider: 'local'");
  expect(config).not.toContain("type: 'static'");
  expect(config).not.toContain("api: '/api/search'");
});

test('local search scaffolds static index and removes api search (tanstack)', async () => {
  const tmp = path.join(import.meta.dirname, './.output/search-local-tanstack');
  await create({
    outputDir: tmp,
    template: 'react',
    plugins: [staticSearch()],
  });

  await expect(fs.access(path.join(tmp, 'src/routes/static[.]json.ts'))).resolves.toBeUndefined();
  await expect(fs.access(path.join(tmp, 'src/routes/api/search.ts'))).rejects.toThrow();
  await expect(fs.access(path.join(tmp, 'src/lib/export-search-indexes.ts'))).resolves.toBeUndefined();

  const config = await fs.readFile(path.join(tmp, 'src/lib/watanuki.config.ts'), 'utf-8');
  expect(config).toContain("provider: 'local'");
});

test('algolia search wires config env and keeps search dialog resolver (next)', async () => {
  const tmp = path.join(import.meta.dirname, './.output/search-algolia-next');
  await create({
    outputDir: tmp,
    template: 'next',
    plugins: [search('algolia')],
  });

  const config = await fs.readFile(path.join(tmp, 'lib/watanuki.config.ts'), 'utf-8');
  expect(config).toContain("provider: 'algolia'");
  expect(config).toContain('NEXT_PUBLIC_ALGOLIA_APP_ID');

  const searchLib = await fs.readFile(path.join(tmp, 'lib/search.ts'), 'utf-8');
  expect(searchLib).toContain('AlgoliaSearchDialog');
  expect(searchLib).toContain("case 'algolia'");

  const provider = await fs.readFile(path.join(tmp, 'components/docs-root-provider.tsx'), 'utf-8');
  expect(provider).toContain('resolveSearchDialog');

  await expect(fs.access(path.join(tmp, 'app/api/search/route.ts'))).rejects.toThrow();
  await expect(fs.access(path.join(tmp, 'app/static.json/route.ts'))).rejects.toThrow();
});

test('orama cloud search wires config env and keeps search dialog resolver (tanstack)', async () => {
  const tmp = path.join(import.meta.dirname, './.output/search-orama-tanstack');
  await create({
    outputDir: tmp,
    template: 'react',
    plugins: [search('orama')],
  });

  const config = await fs.readFile(path.join(tmp, 'src/lib/watanuki.config.ts'), 'utf-8');
  expect(config).toContain("provider: 'orama'");
  expect(config).toContain('VITE_ORAMA_PROJECT_ID');

  const pkg = JSON.parse(await fs.readFile(path.join(tmp, 'package.json'), 'utf-8'));
  expect(pkg.dependencies['@orama/core']).toBeTruthy();

  const searchLib = await fs.readFile(path.join(tmp, 'src/lib/search.ts'), 'utf-8');
  expect(searchLib).toContain('OramaSearchDialog');
  expect(searchLib).toContain("case 'orama'");

  const provider = await fs.readFile(
    path.join(tmp, 'src/components/docs-root-provider.tsx'),
    'utf-8',
  );
  expect(provider).toContain('resolveSearchDialog');

  await expect(fs.access(path.join(tmp, 'src/routes/api/search.ts'))).rejects.toThrow();
});
