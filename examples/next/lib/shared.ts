export const appName = 'My App';
const fallbackSiteUrl = 'http://localhost:3000';

function normalizeSiteUrl(value?: string): string {
  if (!value) return fallbackSiteUrl;

  try {
    return new URL(value.startsWith('http') ? value : `https://${value}`).origin;
  } catch {
    return fallbackSiteUrl;
  }
}

/** Public canonical URL. Set NEXT_PUBLIC_SITE_URL for production. */
export const siteUrl = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL,
);
export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';
export const docsContentRoute = '/llms.mdx/docs';

// fill this with your actual GitHub info, for example:
export const gitConfig = {
  user: 'ctrlcat0x',
  repo: 'watanuki',
  branch: 'main',
};
