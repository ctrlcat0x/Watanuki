import react from '@vitejs/plugin-react';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { defineConfig, type Plugin } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@watanuki/mdx/vite';
import { nitro } from 'nitro/vite';
import fs from 'node:fs/promises';
import path from 'node:path';

async function patchReactRequireInDir(dir: string) {
  let entries: string[];
  try {
    entries = await fs.readdir(dir);
  } catch {
    return;
  }

  await Promise.all(
    entries.map(async (entry) => {
      const full = path.join(dir, entry);
      const stat = await fs.stat(full);
      if (stat.isDirectory()) {
        await patchReactRequireInDir(full);
        return;
      }
      if (!entry.endsWith('.mjs') && !entry.endsWith('.js')) return;

      const code = await fs.readFile(full, 'utf8');
      if (!code.includes('__require("react")') && !code.includes("__require('react')")) return;

      const match = code.match(/require_react(?:\$\d+)?/);
      if (!match) return;

      const patched = code
        .replaceAll('__require("react")', `${match[0]}()`)
        .replaceAll("__require('react')", `${match[0]}()`);
      if (patched !== code) await fs.writeFile(full, patched);
    }),
  );
}

/**
 * Rolldown leaves `require("react")` as runtime `__require("react")` inside
 * bundled `use-sync-external-store/shim` (Base UI), while React itself is
 * already inlined as `require_react()`. That dual instance makes
 * `useSyncExternalStore` hit a null dispatcher during SSR/prerender.
 *
 * ponytail: drop when rolldown rewrites CJS require("react") to inlined react
 * (rolldown#9407 / nitro#4171).
 */
function patchReactRequire(): Plugin {
  return {
    name: 'patch-react-require',
    generateBundle(_options, bundle) {
      for (const chunk of Object.values(bundle)) {
        if (chunk.type !== 'chunk') continue;
        if (!chunk.code.includes('__require("react")') && !chunk.code.includes("__require('react')")) {
          continue;
        }
        const match = chunk.code.match(/require_react(?:\$\d+)?/);
        if (!match) continue;
        chunk.code = chunk.code
          .replaceAll('__require("react")', `${match[0]}()`)
          .replaceAll("__require('react')", `${match[0]}()`);
      }
    },
    async closeBundle() {
      // Nitro may emit SSR chunks after Vite's generateBundle — patch on disk.
      await Promise.all([
        patchReactRequireInDir(path.resolve('.vercel/output')),
        patchReactRequireInDir(path.resolve('.output')),
      ]);
    },
  };
}

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    // First in list → closeBundle runs last (after Nitro writes SSR chunks)
    patchReactRequire(),
    mdx(),
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: true,
        // Only prerender explicit pages (static.json / sitemap). HTML crawl is
        // unnecessary for search indexes.
        crawlLinks: false,
      },
      pages: [{ path: '/sitemap.xml' }],
    }),
    react(),
    nitro({
      preset: 'vercel',
    }),
  ],
  resolve: {
    tsconfigPaths: true,
    dedupe: ['react', 'react-dom'],
    alias: {
      tslib: 'tslib/tslib.es6.js',
    },
  },
});
