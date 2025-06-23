import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { displayMadeWithLove } from '../madeWithLove';

describe('displayMadeWithLove', () => {
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it('prints the made with love message', () => {
    displayMadeWithLove();
    expect(logSpy).toHaveBeenCalledTimes(2);
    const calls = logSpy.mock.calls.map(call => call[0]);
    expect(calls[0]).toContain('─'.repeat(40));
    expect(calls[1]).toContain('Made with ❤️  by');
    expect(calls[1]).toContain('Barry Michael Doyle');
  });
});
