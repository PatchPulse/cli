import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { isVersionOutdated } from '../isVersionOutdated';

describe('isVersionOutdated', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('should return true for outdated versions', () => {
    expect(isVersionOutdated({ current: '1.2.3', latest: '1.2.4' })).toBe(true);
    expect(isVersionOutdated({ current: '1.2.3', latest: '1.3.0' })).toBe(true);
    expect(isVersionOutdated({ current: '1.2.3', latest: '2.0.0' })).toBe(true);
  });

  it('should return false for up-to-date versions', () => {
    expect(isVersionOutdated({ current: '1.2.3', latest: '1.2.3' })).toBe(
      false
    );
    expect(isVersionOutdated({ current: '1.2.4', latest: '1.2.3' })).toBe(
      false
    );
    expect(isVersionOutdated({ current: '1.3.0', latest: '1.2.3' })).toBe(
      false
    );
  });

  it('should handle version ranges', () => {
    expect(isVersionOutdated({ current: '^1.2.3', latest: '1.2.4' })).toBe(
      true
    );
    expect(isVersionOutdated({ current: '~1.2.3', latest: '1.2.4' })).toBe(
      true
    );
  });

  it('should handle latest major version being lower than current major version', () => {
    expect(isVersionOutdated({ current: '2.0.0', latest: '1.0.0' })).toBe(
      false
    );
  });

  it('should handle latest minor version being lower than current minor version', () => {
    expect(isVersionOutdated({ current: '1.3.0', latest: '1.2.0' })).toBe(
      false
    );
  });

  it('should handle latest patch version being lower than current patch version', () => {
    expect(isVersionOutdated({ current: '1.2.4', latest: '1.2.3' })).toBe(
      false
    );
  });

  it('should handle invalid version formats', () => {
    expect(isVersionOutdated({ current: 'invalid', latest: '1.2.3' })).toBe(
      false
    );
    expect(isVersionOutdated({ current: '1.2.3', latest: 'invalid' })).toBe(
      false
    );
  });
});
