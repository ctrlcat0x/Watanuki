import type { TemplatePlugin } from '@/index';
import { writeFile } from '@/utils';
import path from 'node:path';
import fs from 'node:fs/promises';
import {
  isNextTemplate,
  isReactTemplate,
  isWakuTemplate,
} from '@/constants';
import { tanstackStartRoutes } from '@/transform';

const exportLib = `import { source } from '@/lib/source';
import { exportSearchIndexes } from '@watanuki/core/search/server';

export async function exportSearchIndexesFromSource() {
  return exportSearchIndexes(source, {
    language: 'english',
  });
}
`;

const routes = {
  next: `import { exportSearchIndexesFromSource } from '@/lib/export-search-indexes';

export const revalidate = false;

export async function GET() {
  return Response.json(await exportSearchIndexesFromSource());
}`,
  tanstack: `import { createFileRoute } from '@tanstack/react-router';
import { exportSearchIndexesFromSource } from '@/lib/export-search-indexes';

export const Route = createFileRoute('/static.json')({
  server: {
    handlers: {
      GET: async () => Response.json(await exportSearchIndexesFromSource()),
    },
  },
});`,
  waku: `import { exportSearchIndexesFromSource } from '@/lib/export-search-indexes';

export async function GET() {
  return Response.json(await exportSearchIndexesFromSource());
}

export const getConfig = () => ({
  render: 'static',
});`,
};

function getConfigPath(dest: string, isNext: boolean) {
  return path.join(dest, isNext ? 'lib/watanuki.config.ts' : 'src/lib/watanuki.config.ts');
}

function replaceSearchBlock(source: string) {
  const replacement = `  search: {
    provider: 'local',
  },`;

  if (source.includes('search: {')) {
    return source.replace(/search:\s*\{[\s\S]*?\n\s*\},/m, replacement);
  }

  return source.replace(/defaultTheme:\s*'[^']*',/m, (match) => `${match}\n${replacement}`);
}

/** Local search = client-side fuzzy over a prebuilt `/static.json` index. */
export function staticSearch(): TemplatePlugin {
  return {
    readme(content) {
      return `${content}

## Local search

Search indexes are pre-rendered to \`/static.json\` at build time. The client runs fuzzy search in the browser — no \`/api/search\` route required.`;
    },
    async afterWrite() {
      const { dest, appDir, template } = this;
      const next = isNextTemplate(template);
      const exportPath = path.join(dest, next ? 'lib' : 'src/lib', 'export-search-indexes.ts');
      await writeFile(exportPath, exportLib);

      let config = await fs.readFile(getConfigPath(dest, next), 'utf-8');
      config = replaceSearchBlock(config);
      await writeFile(getConfigPath(dest, next), config);

      if (isReactTemplate(template)) {
        await tanstackStartRoutes(this, (mod) => {
          mod.addRoute({
            path: 'static[.]json.ts',
            route: '/static.json',
            code: routes.tanstack,
            prerender: true,
          });
          mod.removeRoute({
            path: 'api/search.ts',
            route: '/api/search',
          });
        });
      } else if (isNextTemplate(template)) {
        await Promise.all([
          fs.unlink(path.join(appDir, 'app/api/search/route.ts')).catch(() => null),
          writeFile(path.join(appDir, 'app/static.json/route.ts'), routes.next),
        ]);
      } else if (isWakuTemplate(template)) {
        await Promise.all([
          fs.unlink(path.join(appDir, 'pages/_api/api/search.ts')).catch(() => null),
          writeFile(path.join(appDir, 'pages/_api/static.json.ts'), routes.waku),
        ]);
      }

      this.log('Configured local search');
    },
  };
}
