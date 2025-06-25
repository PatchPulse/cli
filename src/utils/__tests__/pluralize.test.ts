import { describe, expect, it } from 'vitest';
import { pluralize } from '../pluralize';

describe('pluralize', () => {
  it('should return the singular form when count is 1', () => {
    expect(pluralize({ count: 1, singular: 'test', plural: 'tests' })).toBe(
      'test'
    );
  });

  it('should return the plural form when count is greater than 1', () => {
    expect(pluralize({ count: 2, singular: 'test', plural: 'tests' })).toBe(
      'tests'
    );
  });

  it('should return the plural form when count is 0', () => {
    expect(pluralize({ count: 0, singular: 'test', plural: 'tests' })).toBe(
      'tests'
    );
  });
});
