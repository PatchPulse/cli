import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { displayHelp } from '../help';
import * as madeWithLove from '../madeWithLove';

describe('displayHelp', () => {
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

  it('prints the help message and calls displayMadeWithLove', () => {
    displayHelp();
    expect(logSpy).toHaveBeenCalled();
    const output = logSpy.mock.calls.map(call => call[0]).join('\n');
    expect(output).toContain('Patch Pulse CLI');
    expect(output).toContain('Usage:');
    expect(output).toContain('Options:');
    expect(output).toContain('Configuration File:');
    expect(madeWithLoveSpy).toHaveBeenCalled();
  });
});
