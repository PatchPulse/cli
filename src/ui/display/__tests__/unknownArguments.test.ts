import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { displayUnknownArguments } from '../unknownArguments';

describe('displayUnknownArguments', () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    errorSpy.mockRestore();
    logSpy.mockRestore();
  });

  it('displays unknown command error and help suggestions', () => {
    displayUnknownArguments(['--unknown', '--flag']);
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('❌ Unknown command:')
    );
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('--unknown --flag')
    );
    expect(logSpy).toHaveBeenCalled();
    const output = logSpy.mock.calls.map(call => call[0]).join('\n');
    expect(output).toContain('Available commands:');
    expect(output).toContain('npx patch-pulse');
    expect(output).toContain('npx patch-pulse --help');
    expect(output).toContain('Configuration options:');
    expect(output).toContain('For more information:');
  });

  it('handles single unknown argument', () => {
    displayUnknownArguments(['--invalid']);
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('--invalid'));
  });

  it('handles empty array of unknown arguments', () => {
    displayUnknownArguments([]);
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('❌ Unknown command:')
    );
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining(''));
  });
});
