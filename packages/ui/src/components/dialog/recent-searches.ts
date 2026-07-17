const STORAGE_KEY = 'watanuki-recent-searches';
const MAX_RECENT = 5;

function read(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((v): v is string => typeof v === 'string' && v.trim().length > 0);
  } catch {
    return [];
  }
}

function write(items: string[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_RECENT)));
}

/** Key: `watanuki-recent-searches` — JSON string array, most-recent first, max 5. */
export function getRecentSearches(): string[] {
  return read().slice(0, MAX_RECENT);
}

export function addRecentSearch(query: string): string[] {
  const trimmed = query.trim();
  if (!trimmed) return getRecentSearches();

  const next = [trimmed, ...read().filter((q) => q.toLowerCase() !== trimmed.toLowerCase())].slice(
    0,
    MAX_RECENT,
  );
  write(next);
  return next;
}

export function removeRecentSearch(query: string): string[] {
  const next = read().filter((q) => q.toLowerCase() !== query.trim().toLowerCase());
  write(next);
  return next;
}

export function clearRecentSearches(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

export { STORAGE_KEY as RECENT_SEARCHES_KEY };
