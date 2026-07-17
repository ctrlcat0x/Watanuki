import { slugRegex } from './slugger-regex';

const hasOwn = Object.hasOwn;

export default class GithubSlugger {
  private occurrences: Record<string, number> = Object.create(null);

  slug(value: string, maintainCase: boolean = false): string {
    let result = slug(value, maintainCase);
    const original = result;

    while (hasOwn(this.occurrences, result)) {
      this.occurrences[original]++;
      result = `${original}-${this.occurrences[original]}`;
    }

    this.occurrences[result] = 0;
    return result;
  }

  reset(): void {
    this.occurrences = Object.create(null);
  }
}

export function slug(value: unknown, maintainCase: boolean = false): string {
  if (typeof value !== 'string') return '';
  const normalized = maintainCase ? value : value.toLowerCase();
  return normalized.replace(slugRegex, '').replaceAll(' ', '-');
}
