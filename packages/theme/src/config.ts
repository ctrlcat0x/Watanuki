export const WATANUKI_STYLES = ['classic', 'minimal', 'modern'] as const;

export const WATANUKI_THEMES = [
  'light',
  'dark',
  'catppuccin',
  'monokai',
  'gruvbox-hard',
  'gruvbox-soft',
  'vercel',
  'dracula',
  'ayu',
  'lobster',
  'notion',
  'oscurange',
  'synthwave',
  'winter',
  'spring',
  'autumn',
  'summer',
] as const;

export const WATANUKI_DARK_THEMES = [
  'dark',
  'catppuccin',
  'monokai',
  'gruvbox-hard',
  'vercel',
  'dracula',
  'ayu',
  'lobster',
  'notion',
  'oscurange',
  'synthwave',
  'winter',
  'autumn',
] as const;

export type WatanukiStyle = (typeof WATANUKI_STYLES)[number];
export type WatanukiTheme = (typeof WATANUKI_THEMES)[number];
export const WATANUKI_TOC_STYLES = ['clerk', 'tab', 'basic'] as const;
export type WatanukiTOCStyle = (typeof WATANUKI_TOC_STYLES)[number];

export const THEME_LABELS: Record<WatanukiTheme, string> = {
  light: 'Light',
  dark: 'Dark',
  catppuccin: 'Catppuccin',
  monokai: 'Monokai',
  'gruvbox-hard': 'Gruvbox Hard',
  'gruvbox-soft': 'Gruvbox Soft',
  vercel: 'Vercel',
  dracula: 'Dracula',
  ayu: 'Ayu',
  lobster: 'Lobster',
  notion: 'Notion',
  oscurange: 'Oscurange',
  synthwave: 'Synthwave',
  winter: 'Winter',
  spring: 'Spring',
  autumn: 'Autumn',
  summer: 'Summer',
};

/** Accent (primary) hex for each theme — used by theme switcher swatches */
export const THEME_ACCENTS: Record<WatanukiTheme, string> = {
  light: '#1a1a1a',
  dark: '#fafafa',
  catppuccin: '#caa6f7',
  monokai: '#47d16a',
  'gruvbox-hard': '#d79b42',
  'gruvbox-soft': '#a66130',
  vercel: '#fafafa',
  dracula: '#ff79c6',
  ayu: '#e6b450',
  lobster: '#ff5c5c',
  notion: '#3183d8',
  oscurange: '#f9b98c',
  synthwave: '#ff4dc4',
  winter: '#47adf5',
  spring: '#2c9653',
  autumn: '#ee862b',
  summer: '#da9c0b',
};

export interface WatanukiThemeConfig {
  /** Structural layout skin — set in code, not user UI */
  style: WatanukiStyle;
  /** Default color theme for first visit */
  defaultTheme?: WatanukiTheme;
  /** Table of contents presentation */
  toc?: {
    style?: WatanukiTOCStyle;
  };
}

export const WATANUKI_SEARCH_PROVIDERS = ['local', 'algolia', 'orama'] as const;

export type WatanukiSearchProvider = (typeof WATANUKI_SEARCH_PROVIDERS)[number];

export interface WatanukiLocalSearchConfig {
  /** Built-in client-side fuzzy search over docs (loads `/static.json` by default) */
  provider?: 'local';
  /** Static search index URL. Defaults to `/static.json`. */
  api?: string;
}

export interface WatanukiAlgoliaSearchConfig {
  provider: 'algolia';
  appId: string;
  apiKey: string;
  indexName: string;
  searchParams?: Record<string, unknown>;
}

export interface WatanukiOramaSearchConfig {
  provider: 'orama';
  projectId: string;
  apiKey: string;
  index?: string;
  params?: Record<string, unknown>;
}

export type WatanukiSearchConfig =
  | WatanukiLocalSearchConfig
  | WatanukiAlgoliaSearchConfig
  | WatanukiOramaSearchConfig;

export type WatanukiRssType = 'blog' | 'changelog';

export interface WatanukiSeoConfig {
  /** Open Graph images via `/og/...` routes */
  og?: { enabled?: boolean };
  /** RSS feeds for content collections */
  rss?: {
    enabled?: boolean;
    /** Which collections emit feeds. Default: `['blog']` when enabled. */
    types?: WatanukiRssType[];
  };
  /** Emit `/sitemap.xml` */
  sitemap?: boolean;
  /** Emit `/robots.txt` */
  robots?: boolean;
  /** JSON-LD (WebSite / TechArticle / BlogPosting) */
  structuredData?: boolean;
  /** Emit `/llms.txt` and `/llms-full.txt` */
  llms?: boolean;
  /** X / Twitter site or creator handle (e.g. `@acme`) */
  x?: { handle?: string };
}

export interface WatanukiConfig extends WatanukiThemeConfig {
  search?: WatanukiSearchConfig;
  seo?: WatanukiSeoConfig;
}

export function defineConfig<T extends WatanukiConfig>(config: T): T {
  return config;
}

export const defaultConfig: WatanukiConfig = {
  style: 'minimal',
  defaultTheme: 'dark',
  toc: {
    style: 'clerk',
  },
  search: {
    provider: 'local',
  },
  seo: {
    og: { enabled: true },
    rss: { enabled: true, types: ['blog'] },
    sitemap: true,
    robots: true,
    structuredData: true,
    llms: true,
  },
};

export function isDarkTheme(theme: string): boolean {
  return (WATANUKI_DARK_THEMES as readonly string[]).includes(theme);
}
