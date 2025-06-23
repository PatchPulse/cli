import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { displayUpdateAvailable } from '../updateAvailable';

describe('displayUpdateAvailable', () => {
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it('displays update available message with version information', () => {
    displayUpdateAvailable('1.0.0', '2.0.0');
    expect(logSpy).toHaveBeenCalled();
    const output = logSpy.mock.calls.map(call => call[0]).join('\n');
    expect(output).toContain('═'.repeat(50));
    expect(output).toContain('🚀 UPDATE AVAILABLE!');
    expect(output).toContain('Current Version:');
    expect(output).toContain('1.0.0');
    expect(output).toContain('Latest Version:');
    expect(output).toContain('2.0.0');
    expect(output).toContain('To update, run:');
    expect(output).toContain('npx patch-pulse@latest');
  });

  it('handles different version formats', () => {
    displayUpdateAvailable('1.2.3-beta.1', '1.2.3');
    const output = logSpy.mock.calls.map(call => call[0]).join('\n');
    expect(output).toContain('1.2.3-beta.1');
    expect(output).toContain('1.2.3');
  });

  it('displays the correct number of lines', () => {
    displayUpdateAvailable('1.0.0', '2.0.0');
    // Should have 8 console.log calls: separator, title, separator, current version, latest version, update instruction, command, separator
    expect(logSpy).toHaveBeenCalledTimes(8);
  });
});
