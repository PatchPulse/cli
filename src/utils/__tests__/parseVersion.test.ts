import { describe, expect, it } from 'vitest';
import { parseVersion } from '../parseVersion';

describe('parseVersion', () => {
  it('should parse clean version strings', () => {
    expect(parseVersion('1.2.3')).toEqual({
      major: 1,
      minor: 2,
      patch: 3,
    });
  });

  it('should parse versions with range prefixes', () => {
    expect(parseVersion('^1.2.3')).toEqual({
      major: 1,
      minor: 2,
      patch: 3,
    });
    expect(parseVersion('~1.2.3')).toEqual({
      major: 1,
      minor: 2,
      patch: 3,
    });
    expect(parseVersion('>=1.2.3')).toEqual({
      major: 1,
      minor: 2,
      patch: 3,
    });
  });

  it('should throw error for invalid version formats', () => {
    expect(() => parseVersion('invalid')).toThrow(
      'Invalid version format: invalid'
    );
    expect(() => parseVersion('1.2')).toThrow('Invalid version format: 1.2');
    expect(() => parseVersion('1')).toThrow('Invalid version format: 1');
  });
});
