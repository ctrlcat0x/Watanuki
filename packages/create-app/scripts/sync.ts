import { copy } from '../src/utils.ts';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';
import { glob } from 'tinyglobby';

const dir = path.dirname(fileURLToPath(import.meta.url));
const examplesDir = path.join(dir, '../../examples');
const templateDir = path.join(dir, '../template');

const templates = [
  'waku',
  'tanstack-start',
  ['tanstack-start', 'react'],
  'next',
];

async function rm(files: string[]) {
  await Promise.all(files.map((file) => fs.rm(file)));
}

async function main() {
  await Promise.all(
    templates.map(async (template) => {
      template = Array.isArray(template) ? template : [template, template];
      const inDir = path.join(examplesDir, template[0]);
      const outDir = path.join(templateDir, template[1]);
      const exists = await fs
        .stat(inDir)
        .then(() => true)
        .catch(() => false);
      if (!exists) return;

      await rm(
        await glob(['**/*', '!README.md'], {
          cwd: outDir,
          absolute: true,
        }),
      );

      await copy(inDir, outDir, {
        rename(name) {
          switch (path.basename(name)) {
            case '.gitignore':
              return path.join(path.dirname(name), 'example.gitignore');
            default:
              return name;
          }
        },
        filterDir(dir) {
          const base = path.basename(dir);

          switch (base) {
            case 'node_modules':
            case 'dist':
            case 'out':
            case 'build':
              return false;
            default:
              return !base.startsWith('.');
          }
        },
        filter(name) {
          const base = path.basename(name);

          switch (base) {
            case 'next-env.d.ts':
            case 'pages.gen.ts':
            case 'routeTree.gen.ts':
            case 'README.md':
            case 'tsconfig.tsbuildinfo':
              return false;
            case '.gitignore':
            case '.env.example':
              return true;
            default:
              return !base.startsWith('.');
          }
        },
      });
    }),
  );

  console.log('updated create-watanuki');
}

void main();
