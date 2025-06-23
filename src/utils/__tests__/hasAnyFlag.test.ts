import { describe, expect, it } from 'vitest';
import { hasAnyFlag } from '../hasAnyFlag';

describe('hasAnyFlag', () => {
  it('should return true when a flag is present in args', () => {
    const args = ['--help', '--version'];
    const flags = ['--help'];

    expect(hasAnyFlag(args, flags)).toBe(true);
  });
  it('should return true when multiple flags are present in args', () => {
    const args = ['--help', '--version', '--license'];
    const flags = ['--help', '--version'];

    expect(hasAnyFlag(args, flags)).toBe(true);
  });

  it('should return false when no flags are present in args', () => {
    const args = ['--unknown', 'some-other-arg'];
    const flags = ['--help', '--version'];

    expect(hasAnyFlag(args, flags)).toBe(false);
  });

  it('should return false when args array is empty', () => {
    const args: string[] = [];
    const flags = ['--help', '--version'];

    expect(hasAnyFlag(args, flags)).toBe(false);
  });

  it('should return false when flags array is empty', () => {
    const args = ['--help', '--version'];
    const flags: string[] = [];

    expect(hasAnyFlag(args, flags)).toBe(false);
  });

  it('should return false when both arrays are empty', () => {
    const args: string[] = [];
    const flags: string[] = [];

    expect(hasAnyFlag(args, flags)).toBe(false);
  });

  it('should handle short flags correctly', () => {
    const args = ['-h', '-v', '--help'];
    const flags = ['-h', '-v'];

    expect(hasAnyFlag(args, flags)).toBe(true);
  });

  it('should handle mixed short and long flags', () => {
    const args = ['-h', '--version', '--license'];
    const flags = ['--help', '-v'];

    expect(hasAnyFlag(args, flags)).toBe(false);
  });

  it('should be case sensitive', () => {
    const args = ['--HELP', '--Version'];
    const flags = ['--help', '--version'];

    expect(hasAnyFlag(args, flags)).toBe(false);
  });

  it('should handle duplicate flags in args', () => {
    const args = ['--help', '--help', '--version'];
    const flags = ['--help'];

    expect(hasAnyFlag(args, flags)).toBe(true);
  });

  it('should handle duplicate flags in flags array', () => {
    const args = ['--help', '--version'];
    const flags = ['--help', '--help', '--version'];

    expect(hasAnyFlag(args, flags)).toBe(true);
  });

  it('should handle flags with values', () => {
    const args = ['--skip', 'some-package', '--help'];
    const flags = ['--skip', '--help'];

    expect(hasAnyFlag(args, flags)).toBe(true);
  });

  it('should work with single flag', () => {
    const args = ['--help'];
    const flags = ['--help'];

    expect(hasAnyFlag(args, flags)).toBe(true);
  });

  it('should work with single arg and multiple flags', () => {
    const args = ['--help'];
    const flags = ['--help', '--version', '--license'];

    expect(hasAnyFlag(args, flags)).toBe(true);
  });

  it('should work with multiple args and single flag', () => {
    const args = ['--help', '--version', '--license'];
    const flags = ['--help'];

    expect(hasAnyFlag(args, flags)).toBe(true);
  });
});
