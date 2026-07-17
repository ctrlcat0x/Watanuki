import { DataEngine } from '@/components/playground/state';
import { expect, test } from 'vitest';

test('data engine initializes, updates, and deletes nested fields', () => {
  const engine = new DataEngine({});

  expect(engine.init(['body', 'items', 0], 'first')).toBe('first');
  expect(engine.update(['body', 'items', 0], 'updated')).toBe(true);
  expect(engine.get(['body', 'items', 0])).toBe('updated');
  expect(engine.delete(['body', 'items', 0])).toBe('updated');
  expect(engine.getData()).toEqual({ body: { items: [] } });
});
