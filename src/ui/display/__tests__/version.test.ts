import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as madeWithLove from '../madeWithLove';
import { displayVersion } from '../version';

describe('displayVersion', () => {
  let logSpy: ReturnType<typeof vi.spyOn>;
  let madeWithLoveSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    madeWithLoveSpy = vi
      .spyOn(madeWithLove, 'displayMadeWithLove')
      .mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
    madeWithLoveSpy.mockRestore();
  });

  it('prints version information and calls displayMadeWithLove', () => {
    displayVersion();
    expect(logSpy).toHaveBeenCalled();
    const output = logSpy.mock.calls.map(call => call[0]).join('\n');
    expect(output).toContain('Patch Pulse CLI');
    expect(output).toContain('Version:');
    expect(output).toContain('Author:');
    expect(output).toContain('Repo:');
    expect(output).toContain('License:');
    expect(output).toContain('MIT');
    expect(output).toContain('https://github.com/PatchPulse/cli');
    expect(madeWithLoveSpy).toHaveBeenCalled();
  });

  it('displays the correct number of lines', () => {
    displayVersion();
    // Should have 1 console.log call for the version info, plus displayMadeWithLove will add more
    expect(logSpy).toHaveBeenCalledTimes(1);
  });
});
