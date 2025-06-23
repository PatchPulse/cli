import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { displayLicense } from '../license';

vi.mock('fs', () => ({
  readFileSync: vi.fn(),
}));

describe('displayLicense', () => {
  let logSpy: ReturnType<typeof vi.spyOn>;
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
    errorSpy.mockRestore();
    vi.clearAllMocks();
  });

  it('prints the license content when LICENSE file is present', async () => {
    const fs = await import('fs');
    vi.mocked(fs.readFileSync).mockReturnValue('MIT License\nCopyright 2024');
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('exit');
    });
    try {
      displayLicense();
    } catch {
      // expected if process.exit is called
    }
    expect(fs.readFileSync).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalled();
    const output = logSpy.mock.calls.map(call => call[0]).join('\n');
    expect(output).toContain('License');
    expect(output).toContain('MIT License');
    expect(output).toContain('Copyright 2024');
    expect(errorSpy).not.toHaveBeenCalled();
    exitSpy.mockRestore();
  });

  it('prints an error and fallback license if LICENSE file is missing', async () => {
    const fs = await import('fs');
    vi.mocked(fs.readFileSync).mockImplementation(() => {
      throw new Error('File not found');
    });
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('exit');
    });
    try {
      displayLicense();
    } catch {
      // expected due to process.exit mock
    }
    expect(errorSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('License: MIT')
    );
    exitSpy.mockRestore();
  });
});
