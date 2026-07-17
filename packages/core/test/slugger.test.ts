import { describe, expect, it } from 'vitest';
import GithubSlugger, { slug } from '../src/utils/slugger';

describe('GithubSlugger', () => {
  it('matches GitHub heading slugs', () => {
    expect(slug('Hello, Watanuki!')).toBe('hello-watanuki');
    expect(slug('Привет 世界')).toBe('привет-世界');
    expect(slug('Mixed Case', true)).toBe('Mixed-Case');
    expect(slug(null)).toBe('');
  });

  it('deduplicates and resets slugs', () => {
    const slugger = new GithubSlugger();

    expect(slugger.slug('Hello')).toBe('hello');
    expect(slugger.slug('Hello')).toBe('hello-1');
    expect(slugger.slug('Hello-1')).toBe('hello-1-1');
    slugger.reset();
    expect(slugger.slug('Hello')).toBe('hello');
  });
});
