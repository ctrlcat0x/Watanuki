import { compile } from '@/utils/json-schema-ts';
import { describe, expect, test } from 'vitest';

const schema = {
  type: 'object',
  title: 'Pet',
  required: ['id'],
  properties: {
    id: { type: 'integer' },
    name: { type: 'string' },
    secret: { type: 'string', writeOnly: true },
    createdAt: { type: 'string', readOnly: true },
  },
} as const;

describe('local JSON Schema compiler', () => {
  test('generates object fields and filters access-specific fields', () => {
    expect(compile(schema, { name: 'Pet' })).toBe(
      'export interface Pet { id: number; name?: string }',
    );
    expect(compile(schema, { name: 'Pet', readOnly: true })).toContain(
      'createdAt?: string',
    );
    expect(compile(schema, { name: 'Pet', writeOnly: true })).toContain(
      'secret?: string',
    );
  });
});
