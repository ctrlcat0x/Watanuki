import { describe, expect, it } from 'vitest';
import { cva } from '../src/utils/cva';

describe('cva', () => {
  const variants = cva('base', {
    variants: {
      color: {
        primary: 'primary',
        secondary: 'secondary',
      },
      active: {
        true: 'active',
        false: 'inactive',
      },
    },
    defaultVariants: {
      color: 'primary',
      active: false,
    },
  });

  it('applies defaults, variants, and custom classes', () => {
    expect(variants()).toBe('base primary inactive');
    expect(variants({ color: 'secondary', active: true, className: 'custom' })).toBe(
      'base secondary active custom',
    );
  });

  it('allows null to disable a default variant', () => {
    expect(variants({ color: null })).toBe('base inactive');
  });
});
