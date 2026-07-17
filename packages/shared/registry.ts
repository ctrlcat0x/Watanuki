import { glob } from 'tinyglobby';
import path from 'node:path';

export interface RegistryFile {
  path: string;
  type: string;
  target?: string;
  content?: string;
  meta?: {
    preserveAs?: string;
    [key: string]: unknown;
  };
}

export interface Component {
  name: string;
  title?: string;
  description?: string;
  files?: RegistryFile[];
  dependencies?: Record<string, string | null>;
  devDependencies?: Record<string, string | null>;
  unlisted?: boolean;
  meta?: unknown;
}

export interface Registry {
  name: string;
  dir: string;
  components: Component[];
  packageJson?: string;
  tsconfigPath?: string;
  dependencies?: Record<string, string | null>;
  devDependencies?: Record<string, string | null>;
  subRegistries?: Registry[];
}

export async function findSlotComponents(dir: string): Promise<Component[]> {
  const slots: Component[] = [];

  for (const file of await glob('layouts/**/slots/*', { cwd: dir })) {
    const relativePath = path.relative('layouts', file);
    const name = relativePath
      .split(path.sep)
      .filter((v) => v !== 'slots')
      .join('/')
      .slice(0, -path.extname(relativePath).length);

    slots.push({
      name: `slots/${name}`,
      unlisted: true,
      files: [
        {
          path: file,
          type: 'layout',
          target: `<dir>/${relativePath}`,
        },
      ],
    });
  }

  return slots;
}

export const commonComponents: Component[] = [
  {
    name: 'urls',
    unlisted: true,
    files: [
      {
        type: 'lib',
        path: 'utils/urls.ts',
      },
    ],
  },
  {
    name: 'cn',
    unlisted: true,
    files: [
      {
        type: 'lib',
        path: 'utils/cn.ts',
      },
    ],
  },
  {
    name: 'merge-refs',
    unlisted: true,
    files: [
      {
        type: 'lib',
        path: 'utils/merge-refs.ts',
      },
    ],
  },
  {
    name: 'toc',
    unlisted: true,
    files: [
      {
        type: 'components',
        path: 'components/toc/clerk.tsx',
        target: '<dir>/toc/clerk.tsx',
      },
      {
        type: 'components',
        path: 'components/toc/default.tsx',
        target: '<dir>/toc/default.tsx',
      },
      {
        type: 'components',
        path: 'components/toc/index.tsx',
        target: '<dir>/toc/index.tsx',
      },
    ],
  },
];
