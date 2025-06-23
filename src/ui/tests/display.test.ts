import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createCenteredBox } from '../createCenteredBox';
import { displayMadeWithLove } from '../display/madeWithLove';
import { displayVersion } from '../display/version';

const mockConsoleLog = vi.fn();

describe('Display Functions', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(mockConsoleLog);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    mockConsoleLog.mockClear();
  });

  describe('createCenteredBox', () => {
    it('should create a centered box with the given title and width', () => {
      const result = createCenteredBox('Test Title', 20);

      expect(result).toContain('Test Title');
      expect(result).toContain('╔════════════════════╗');
      expect(result).toContain('╚════════════════════╝');
      expect(result.split('\n')).toHaveLength(3);
    });

    it('should handle odd width correctly', () => {
      const result = createCenteredBox('Test', 11);

      expect(result).toContain('Test');
      expect(result).toContain('╔═══════════╗');
      expect(result).toContain('╚═══════════╝');
    });
  });

  describe('displayMadeWithLove', () => {
    it('should display the made with love message', () => {
      displayMadeWithLove();

      expect(mockConsoleLog).toHaveBeenCalledTimes(2);
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('─'.repeat(40))
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('Made with ❤️')
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('Barry Michael Doyle')
      );
    });
  });

  describe('displayVersion', () => {
    it('should display version information with all required fields', () => {
      displayVersion();

      expect(mockConsoleLog).toHaveBeenCalled();

      const firstCall = mockConsoleLog.mock.calls[0][0];

      expect(firstCall).toContain('Patch Pulse CLI');
      expect(firstCall).toContain('Version:');
      expect(firstCall).toContain('Author:');
      expect(firstCall).toContain('Repo:');
      expect(firstCall).toContain('License:');
      expect(firstCall).toContain('MIT');
      expect(firstCall).toContain('https://github.com/barrymichaeldoyle');
      expect(firstCall).toContain('https://github.com/PatchPulse/cli');

      expect(mockConsoleLog).toHaveBeenCalledTimes(3);
    });

    it('should include the VERSION constant in the output', () => {
      displayVersion();

      const firstCall = mockConsoleLog.mock.calls[0][0];

      expect(firstCall).toMatch(/Version:\s*\d+\.\d+\.\d+/);
    });
  });
});
