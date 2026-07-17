import type { TemplatePlugin, TemplatePluginContext } from '@/index';
import {
  depVersions,
  type SearchProvider,
  isNextTemplate,
  isReactTemplate,
  isWakuTemplate,
} from '@/constants';
import { pick, writeFile } from '@/utils';
import path from 'node:path';
import fs from 'node:fs/promises';
import { tanstackStartRoutes } from '@/transform';
import { createSourceFile } from '@/transform/shared';
import { removeTanstackPrerender } from '@/transform/tanstack-start';

function getConfigPath(dest: string, isNext: boolean) {
  return path.join(dest, isNext ? 'lib/watanuki.config.ts' : 'src/lib/watanuki.config.ts');
}

function getEnvPath(dest: string) {
  return path.join(dest, '.env.example');
}

function replaceSearchBlock(source: string, replacement: string) {
  if (source.includes('search: {')) {
    return source.replace(/search:\s*\{[\s\S]*?\n\s*\},/m, replacement);
  }

  return source.replace(/defaultTheme:\s*'[^']*',/m, (match) => `${match}\n${replacement}`);
}

function getSearchConfig(provider: SearchProvider, envPrefix: string): string {
  switch (provider) {
    case 'algolia':
      return `  search: {
    provider: 'algolia',
    appId: ${envPrefix}_ALGOLIA_APP_ID ?? '',
    apiKey: ${envPrefix}_ALGOLIA_SEARCH_KEY ?? '',
    indexName: ${envPrefix}_ALGOLIA_INDEX_NAME ?? '',
  },`;
    case 'orama':
      return `  search: {
    provider: 'orama',
    projectId: ${envPrefix}_ORAMA_PROJECT_ID ?? '',
    apiKey: ${envPrefix}_ORAMA_PUBLIC_API_KEY ?? '',
    index: ${envPrefix}_ORAMA_INDEX ?? 'docs',
  },`;
    default:
      return `  search: {
    provider: 'local',
  },`;
  }
}

function getEnvPrefix(isNext: boolean) {
  return isNext ? 'process.env.NEXT_PUBLIC' : 'import.meta.env.VITE';
}

function getEnvExample(provider: SearchProvider) {
  switch (provider) {
    case 'algolia':
      return [
        'NEXT_PUBLIC_ALGOLIA_APP_ID=',
        'NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=',
        'NEXT_PUBLIC_ALGOLIA_INDEX_NAME=',
        'VITE_ALGOLIA_APP_ID=',
        'VITE_ALGOLIA_SEARCH_KEY=',
        'VITE_ALGOLIA_INDEX_NAME=',
      ].join('\n');
    case 'orama':
      return [
        'NEXT_PUBLIC_ORAMA_PROJECT_ID=',
        'NEXT_PUBLIC_ORAMA_PUBLIC_API_KEY=',
        'NEXT_PUBLIC_ORAMA_INDEX=docs',
        'VITE_ORAMA_PROJECT_ID=',
        'VITE_ORAMA_PUBLIC_API_KEY=',
        'VITE_ORAMA_INDEX=docs',
      ].join('\n');
    default:
      return '';
  }
}

async function removeStaticSearch(ctx: TemplatePluginContext) {
  const { dest, appDir, template } = ctx;
  const next = isNextTemplate(template);
  const exportPath = path.join(dest, next ? 'lib' : 'src/lib', 'export-search-indexes.ts');

  await fs.unlink(exportPath).catch(() => null);

  if (isReactTemplate(template)) {
    await tanstackStartRoutes(ctx, (mod) => {
      mod.removeRoute({
        path: 'static[.]json.ts',
        route: '/static.json',
      });
    });

    const configFile = await createSourceFile(path.join(dest, 'vite.config.ts'));
    removeTanstackPrerender(configFile, ['/static.json']);
    await configFile.save();
  } else if (isNextTemplate(template)) {
    await fs.unlink(path.join(appDir, 'app/static.json/route.ts')).catch(() => null);
  } else if (isWakuTemplate(template)) {
    await fs.unlink(path.join(appDir, 'pages/_api/static.json.ts')).catch(() => null);
  }
}

async function removeLocalApiSearch(ctx: TemplatePluginContext) {
  const { appDir, template } = ctx;

  if (isReactTemplate(template)) {
    await tanstackStartRoutes(ctx, (mod) => {
      mod.removeRoute({
        path: 'api/search.ts',
        route: '/api/search',
      });
    });
  } else if (isNextTemplate(template)) {
    await fs.unlink(path.join(appDir, 'app/api/search/route.ts')).catch(() => null);
  } else if (isWakuTemplate(template)) {
    await fs.unlink(path.join(appDir, 'pages/_api/api/search.ts')).catch(() => null);
  }
}

/** Algolia / Orama Cloud — removes local static index scaffolding. */
export function search(provider: Exclude<SearchProvider, 'local'>): TemplatePlugin {
  return {
    packageJson(packageJson) {
      if (provider !== 'orama') return packageJson;

      return {
        ...packageJson,
        dependencies: {
          ...packageJson.dependencies,
          ...pick(depVersions, ['@orama/core']),
        },
      };
    },
    readme(content) {
      if (provider === 'algolia') {
        return `${content}

## Algolia search

Fill the Algolia env vars in \`.env\`, then open search — \`DocsRootProvider\` wires \`search-algolia\` from \`lib/search.ts\`.`;
      }

      return `${content}

## Orama Cloud search

Fill the Orama Cloud env vars in \`.env\`, then open search — \`DocsRootProvider\` wires \`search-orama\` from \`lib/search.ts\`.`;
    },
    async afterWrite() {
      const next = isNextTemplate(this.template);
      const configPath = getConfigPath(this.dest, next);
      const config = await fs.readFile(configPath, 'utf-8');
      const updated = replaceSearchBlock(config, getSearchConfig(provider, getEnvPrefix(next)));
      await writeFile(configPath, updated);

      const envExample = getEnvExample(provider);
      if (envExample.length > 0) {
        await writeFile(getEnvPath(this.dest), `${envExample}\n`);
      }

      await removeStaticSearch(this);
      await removeLocalApiSearch(this);

      this.log(`Configured ${provider} search`);
    },
  };
}
