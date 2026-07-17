import { cn } from '@/utils/cn';
import { GitFork, Star } from 'lucide-react';
import type { ComponentProps, SVGProps } from 'react';

function BracesIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M8.02247 12.5552C8.02247 9.72099 10.4494 7.48343 13.4831 7.48343C14.3933 7.48343 15 6.88674 15 5.99171C15 5.09669 14.3933 4.5 13.4831 4.5C8.7809 4.5 4.98876 8.08011 4.98876 12.5552V13.4503C4.98876 14.7928 4.07865 16.1354 2.5618 16.5829C1.95506 16.732 1.5 17.3287 1.5 17.9254C1.5 18.5221 1.95506 19.1188 2.5618 19.4171C4.07865 19.8646 4.98876 21.058 4.98876 22.5497V23.4448C4.98876 27.9199 8.7809 31.5 13.4831 31.5C14.3933 31.5 15 30.9033 15 30.0083C15 29.1133 14.3933 28.5166 13.4831 28.5166C10.4494 28.5166 8.02247 26.279 8.02247 23.4448V22.4006C8.02247 20.6105 7.26404 18.9696 6.05056 17.9254C7.26404 16.732 8.02247 15.0912 8.02247 13.4503V12.5552Z"
        fill="currentColor"
      />
      <path
        d="M33.4382 16.5C31.9213 16.05 31.0112 14.85 31.0112 13.35V12.6C31.0112 8.1 27.2191 4.5 22.5169 4.5C21.6067 4.5 21 5.1 21 6C21 6.9 21.6067 7.5 22.5169 7.5C25.5506 7.5 27.9775 9.75 27.9775 12.6V13.5C27.9775 15.3 28.736 16.95 29.9494 18C28.736 19.2 27.9775 20.85 27.9775 22.5V23.4C27.9775 26.25 25.5506 28.5 22.5169 28.5C21.6067 28.5 21 29.1 21 30C21 30.9 21.6067 31.5 22.5169 31.5C27.2191 31.5 31.0112 27.9 31.0112 23.4V22.5C31.0112 21.15 31.9213 19.8 33.4382 19.35C34.0449 19.2 34.5 18.6 34.5 18C34.5 17.4 34.0449 16.8 33.4382 16.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export interface FetchRepositoryInfoOptions {
  /**
   * Repository owner. Optional when `repo` is `owner/name`.
   */
  owner?: string;
  /**
   * Repository name, or full `owner/name`.
   */
  repo: string;

  baseUrl?: string;
  token?: string;
  fetchOptions?: RequestInit;
}

export interface RepositoryInfo {
  stars: number | null;
  forks: number | null;
  description: string | null;
  language: string | null;
  languageColor: string | null;
}

export interface GithubInfoProps
  extends Omit<ComponentProps<'a'>, 'href'>,
    FetchRepositoryInfoOptions {
  locale?: Intl.LocalesArgument;
}

/** Common GitHub linguist colors — fallback muted when unknown. */
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Rust: '#dea584',
  Go: '#00ADD8',
  Java: '#b07219',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  CSS: '#563d7c',
  HTML: '#e34c26',
  Shell: '#89e051',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  MDX: '#fcb32c',
  Markdown: '#083fa1',
};

const emptyInfo: RepositoryInfo = {
  stars: null,
  forks: null,
  description: null,
  language: null,
  languageColor: null,
};

export function resolveOwnerRepo(
  owner: string | undefined,
  repo: string,
): { owner: string; repo: string } {
  if (owner) {
    return { owner, repo: repo.includes('/') ? (repo.split('/').pop() ?? repo) : repo };
  }

  const slash = repo.indexOf('/');
  if (slash === -1) {
    throw new Error('GithubInfo requires `owner` or `repo` as `owner/name`');
  }

  return {
    owner: repo.slice(0, slash),
    repo: repo.slice(slash + 1),
  };
}

function getLanguageColor(language: string | null | undefined): string | null {
  if (!language) return null;
  return LANGUAGE_COLORS[language] ?? null;
}

/**
 * Uses compact notation (e.g., 1.5K, 2.3M).
 */
const formatterOptions: Intl.NumberFormatOptions = {
  notation: 'compact',
  maximumFractionDigits: 1,
};

const defaultFormatter = new Intl.NumberFormat(undefined, formatterOptions);

export async function fetchRepositoryInfo({
  owner: ownerProp,
  repo: repoProp,
  token,
  baseUrl = 'https://api.github.com',
  fetchOptions = {
    next: {
      revalidate: 60,
    },
  } as RequestInit,
}: FetchRepositoryInfoOptions): Promise<RepositoryInfo> {
  const { owner, repo } = resolveOwnerRepo(ownerProp, repoProp);
  const endpoint = `${baseUrl}/repos/${owner}/${repo}`;
  const headers = new Headers(fetchOptions.headers);

  headers.set('Accept', 'application/vnd.github+json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  try {
    const response = await fetch(endpoint, {
      ...fetchOptions,
      headers,
    } as RequestInit);

    if (!response.ok) {
      // Rate limit / not found / auth — graceful empty stats
      return emptyInfo;
    }

    const data = (await response.json()) as {
      description?: string | null;
      language?: string | null;
      stargazers_count?: number;
      forks_count?: number;
    };

    return {
      stars: data.stargazers_count ?? null,
      forks: data.forks_count ?? null,
      description: data.description ?? null,
      language: data.language ?? null,
      languageColor: getLanguageColor(data.language),
    };
  } catch {
    return emptyInfo;
  }
}

function formatCount(
  value: number | null,
  formatter: Intl.NumberFormat,
): string {
  if (value === null) return '—';
  return formatter.format(value);
}

/**
 * GitHub repository info card. Fetches on the server (RSC) with a 60s cache.
 */
export async function GithubInfo({
  repo: repoProp,
  owner: ownerProp,
  token,
  baseUrl,
  fetchOptions,
  locale,
  className,
  ...props
}: GithubInfoProps) {
  const { owner, repo } = resolveOwnerRepo(ownerProp, repoProp);
  const info = await fetchRepositoryInfo({
    owner,
    repo,
    token,
    baseUrl,
    fetchOptions,
  });
  const formatter = locale ? new Intl.NumberFormat(locale, formatterOptions) : defaultFormatter;
  const href = `https://github.com/${owner}/${repo}`;
  const label = `${owner}/${repo}`;

  return (
    <a
      href={href}
      rel="noreferrer noopener"
      target="_blank"
      aria-label={`GitHub repository ${label}`}
      {...props}
      className={cn(
        'not-prose my-4 flex flex-col gap-2 rounded-xl border border-fd-border bg-fd-card p-4 text-sm text-fd-card-foreground transition-colors hover:bg-fd-accent/80',
        className,
      )}
    >
      <p className="flex items-center gap-2 truncate font-semibold text-fd-primary">
        <BracesIcon className="size-4 shrink-0" />
        <span className="truncate">{repo}</span>
      </p>

      {info.description ? (
        <p className="my-0! line-clamp-2 text-fd-muted-foreground">{info.description}</p>
      ) : null}

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-fd-muted-foreground">
        {info.language ? (
          <span className="inline-flex items-center gap-1.5">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: info.languageColor ?? 'var(--color-fd-muted-foreground)' }}
              aria-hidden="true"
            />
            {info.language}
          </span>
        ) : null}
        <span className="inline-flex items-center gap-1">
          <Star className="size-3.5" aria-hidden="true" />
          {formatCount(info.stars, formatter)}
        </span>
        <span className="inline-flex items-center gap-1">
          <GitFork className="size-3.5" aria-hidden="true" />
          {formatCount(info.forks, formatter)}
        </span>
      </div>
    </a>
  );
}
