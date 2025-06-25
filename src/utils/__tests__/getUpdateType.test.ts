import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getUpdateType } from '../getUpdateType';

describe('getUpdateType', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('should return major for major version updates', () => {
    expect(getUpdateType({ current: '1.2.3', latest: '2.0.0' })).toBe('major');
    expect(getUpdateType({ current: '1.2.3', latest: '2.1.0' })).toBe('major');
  });

  it('should return minor for minor version updates', () => {
    expect(getUpdateType({ current: '1.2.3', latest: '1.3.0' })).toBe('minor');
    expect(getUpdateType({ current: '1.2.3', latest: '1.3.5' })).toBe('minor');
  });

  it('should return patch for patch version updates', () => {
    expect(getUpdateType({ current: '1.2.3', latest: '1.2.4' })).toBe('patch');
    expect(getUpdateType({ current: '1.2.3', latest: '1.2.10' })).toBe('patch');
  });

  it('should return patch for same versions', () => {
    expect(getUpdateType({ current: '1.2.3', latest: '1.2.3' })).toBe('patch');
  });

  it('should handle version ranges', () => {
    expect(getUpdateType({ current: '^1.2.3', latest: '2.0.0' })).toBe('major');
    expect(getUpdateType({ current: '~1.2.3', latest: '1.3.0' })).toBe('minor');
  });

  it('should handle invalid version formats', () => {
    expect(getUpdateType({ current: 'invalid', latest: '1.2.3' })).toBe(
      'patch'
    );
    expect(getUpdateType({ current: '1.2.3', latest: 'invalid' })).toBe(
      'patch'
    );
  });
});
