import { describe, expect, it } from 'vitest';
import { getUnknownArgs } from '../getUnknownArgs';

describe('getUnknownArgs', () => {
  const validFlags = [
    '-h',
    '--help',
    '-i',
    '--info',
    '-v',
    '--version',
    '-l',
    '--license',
    '-s',
    '--skip',
  ];

  it('should return empty array when all args are valid flags', () => {
    const args = ['--help', '--version', '-h'];
    const result = getUnknownArgs({ args, validFlags });

    expect(result).toEqual([]);
  });

  it('should return unknown args when invalid flags are present', () => {
    const args = ['--help', '--unknown', '--version'];
    const result = getUnknownArgs({ args, validFlags });

    expect(result).toEqual(['--unknown']);
  });

  it('should return multiple unknown args', () => {
    const args = ['--help', '--unknown1', '--unknown2', '--version'];
    const result = getUnknownArgs({ args, validFlags });

    expect(result).toEqual(['--unknown1', '--unknown2']);
  });

  it('should return empty array when args array is empty', () => {
    const args: string[] = [];
    const result = getUnknownArgs({ args, validFlags });

    expect(result).toEqual([]);
  });

  it('should return all args when validFlags array is empty', () => {
    const args = ['--help', '--version'];
    const result = getUnknownArgs({ args, validFlags: [] });

    expect(result).toEqual(['--help', '--version']);
  });

  it('should exclude args that come after -s flag', () => {
    const args = ['--help', '-s', 'package-to-skip', '--version'];
    const result = getUnknownArgs({ args, validFlags });

    expect(result).toEqual([]);
  });

  it('should exclude args that come after --skip flag', () => {
    const args = ['--help', '--skip', 'package-to-skip', '--version'];
    const result = getUnknownArgs({ args, validFlags });

    expect(result).toEqual([]);
  });

  it('should exclude multiple args that come after skip flag', () => {
    const args = ['--help', '--skip', 'package1', 'package2', '--version'];
    const result = getUnknownArgs({ args, validFlags });

    expect(result).toEqual([]);
  });

  it('should include unknown args that come before skip flag', () => {
    const args = ['--unknown', '--skip', 'package-to-skip', '--version'];
    const result = getUnknownArgs({ args, validFlags });

    expect(result).toEqual(['--unknown']);
  });

  it('should include unknown args that come after skip flag but are not immediately after', () => {
    const args = ['--skip', 'package-to-skip', '--version', '--unknown'];
    const result = getUnknownArgs({ args, validFlags });

    expect(result).toEqual(['--unknown']);
  });

  it('should handle skip flag at the beginning', () => {
    const args = ['-s', 'package-to-skip', '--help', '--version'];
    const result = getUnknownArgs({ args, validFlags });

    expect(result).toEqual([]);
  });

  it('should handle skip flag at the end', () => {
    const args = ['--help', '--version', '-s', 'package-to-skip'];
    const result = getUnknownArgs({ args, validFlags });

    expect(result).toEqual([]);
  });

  it('should handle multiple skip flags', () => {
    const args = [
      '--help',
      '-s',
      'package1',
      '--skip',
      'package2',
      '--version',
    ];
    const result = getUnknownArgs({ args, validFlags });

    expect(result).toEqual([]);
  });

  it('should handle skip flag with no following args', () => {
    const args = ['--help', '--skip', '--version'];
    const result = getUnknownArgs({ args, validFlags });

    expect(result).toEqual([]);
  });

  it('should handle skip flag as the last argument', () => {
    const args = ['--help', '--version', '--skip'];
    const result = getUnknownArgs({ args, validFlags });

    expect(result).toEqual([]);
  });

  it('should handle mixed valid and invalid flags with skip logic', () => {
    const args = [
      '--unknown1',
      '--help',
      '--skip',
      'package-to-skip',
      '--unknown2',
      '--version',
    ];
    const result = getUnknownArgs({ args, validFlags });

    expect(result).toEqual(['--unknown1']);
  });

  it('should handle short flags correctly', () => {
    const args = ['-h', '-x', '-v', '-y'];
    const result = getUnknownArgs({ args, validFlags });

    expect(result).toEqual(['-x', '-y']);
  });

  it('should be case sensitive', () => {
    const args = ['--HELP', '--Version', '--unknown'];
    const result = getUnknownArgs({ args, validFlags });

    expect(result).toEqual(['--HELP', '--Version', '--unknown']);
  });

  it('should handle duplicate valid flags', () => {
    const args = ['--help', '--help', '--version'];
    const result = getUnknownArgs({ args, validFlags });

    expect(result).toEqual([]);
  });

  it('should handle duplicate unknown flags', () => {
    const args = ['--help', '--unknown', '--unknown', '--version'];
    const result = getUnknownArgs({ args, validFlags });

    expect(result).toEqual(['--unknown', '--unknown']);
  });

  it('should handle complex scenario with multiple skip flags and unknown args', () => {
    const args = [
      '--unknown1',
      '--help',
      '-s',
      'package1',
      '--unknown2',
      '--skip',
      'package2',
      '--version',
      '--unknown3',
    ];
    const result = getUnknownArgs({ args, validFlags });

    expect(result).toEqual(['--unknown1', '--unknown3']);
  });
});
