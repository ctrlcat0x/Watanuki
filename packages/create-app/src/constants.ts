import { fileURLToPath } from 'node:url';
import versionPkg from '../../create-app-versions/package.json';
import * as corePkg from '../../core/package.json';
import * as mdxPkg from '../../mdx/package.json';
import * as uiPkg from '../../ui/package.json';
import * as themePkg from '../../theme/package.json';

export const sourceDir = fileURLToPath(new URL(`../`, import.meta.url).href);

export const isCI = Boolean(process.env.CI);

/** Layout skins — written to watanuki.config.ts at scaffold time */
export const stylePresets = [
  { value: 'classic', label: 'Classic', hint: 'recommended' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'modern', label: 'Modern' },
] as const;

export type StylePreset = (typeof stylePresets)[number]['value'];

export const searchProviders = [
  { value: 'local', label: 'Local (fuzzy)', hint: 'recommended' },
  { value: 'algolia', label: 'Algolia' },
  { value: 'orama', label: 'Orama Cloud' },
] as const;

export type SearchProvider = (typeof searchProviders)[number]['value'];
export type TemplateFamily = 'next' | 'react' | 'waku';

export interface TemplateInfo {
  value: 'next' | 'react' | 'waku';
  label: string;
  family: TemplateFamily;
  appDir: string;
  rootProviderPath: string;
  templateDir: string;
  hint?: string;
  rename?: (name: string) => string;
}

export const templates: TemplateInfo[] = [
  {
    value: 'next',
    label: 'Next.js',
    family: 'next',
    hint: 'recommended',
    appDir: '',
    rootProviderPath: 'app/layout.tsx',
    templateDir: 'next',
  },
  {
    value: 'react',
    label: 'React (TanStack Start)',
    family: 'react',
    appDir: 'src',
    rootProviderPath: 'routes/__root.tsx',
    templateDir: 'tanstack-start',
  },
  {
    value: 'waku',
    label: 'Waku',
    family: 'waku',
    appDir: 'src',
    rootProviderPath: 'pages/_layout.tsx',
    templateDir: 'waku',
  },
];

const workspaces = [corePkg, mdxPkg, uiPkg, themePkg];

export const depVersions = versionPkg.dependencies;

for (const workspace of workspaces) {
  depVersions[workspace.name as keyof typeof depVersions] = workspace.version;
}

export function isNextTemplate(template: Pick<TemplateInfo, 'family'>): boolean {
  return template.family === 'next';
}

export function isReactTemplate(template: Pick<TemplateInfo, 'family'>): boolean {
  return template.family === 'react';
}

export function isWakuTemplate(template: Pick<TemplateInfo, 'family'>): boolean {
  return template.family === 'waku';
}
