import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { displayThankYouMessage } from '../thankYouMessage';

describe('displayThankYouMessage', () => {
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it('prints the thank you message and help info', () => {
    displayThankYouMessage();
    expect(logSpy).toHaveBeenCalledTimes(3);
    const calls = logSpy.mock.calls.map(call => call[0]);
    expect(calls[0]).toBeUndefined(); // Empty line (console.log() with no arguments)
    expect(calls[1]).toContain('🎉 Thank you for using Patch Pulse CLI!');
    expect(calls[2]).toContain('💡 For more info:');
    expect(calls[2]).toContain('npx patch-pulse --help');
  });
});
