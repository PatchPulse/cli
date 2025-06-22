import { describe, expect, it } from 'vitest';
import { getUpdateType, isVersionOutdated, parseVersion } from './version';

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

describe('getUpdateType', () => {
  it('should return major for major version updates', () => {
    expect(getUpdateType('1.2.3', '2.0.0')).toBe('major');
    expect(getUpdateType('1.2.3', '2.1.0')).toBe('major');
  });

  it('should return minor for minor version updates', () => {
    expect(getUpdateType('1.2.3', '1.3.0')).toBe('minor');
    expect(getUpdateType('1.2.3', '1.3.5')).toBe('minor');
  });

  it('should return patch for patch version updates', () => {
    expect(getUpdateType('1.2.3', '1.2.4')).toBe('patch');
    expect(getUpdateType('1.2.3', '1.2.10')).toBe('patch');
  });

  it('should return patch for same versions', () => {
    expect(getUpdateType('1.2.3', '1.2.3')).toBe('patch');
  });

  it('should handle version ranges', () => {
    expect(getUpdateType('^1.2.3', '2.0.0')).toBe('major');
    expect(getUpdateType('~1.2.3', '1.3.0')).toBe('minor');
  });
});

describe('isVersionOutdated', () => {
  it('should return true for outdated versions', () => {
    expect(isVersionOutdated('1.2.3', '1.2.4')).toBe(true);
    expect(isVersionOutdated('1.2.3', '1.3.0')).toBe(true);
    expect(isVersionOutdated('1.2.3', '2.0.0')).toBe(true);
  });

  it('should return false for up-to-date versions', () => {
    expect(isVersionOutdated('1.2.3', '1.2.3')).toBe(false);
    expect(isVersionOutdated('1.2.4', '1.2.3')).toBe(false);
    expect(isVersionOutdated('1.3.0', '1.2.3')).toBe(false);
  });

  it('should handle version ranges', () => {
    expect(isVersionOutdated('^1.2.3', '1.2.4')).toBe(true);
    expect(isVersionOutdated('~1.2.3', '1.2.4')).toBe(true);
  });
});
