import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ProgressSpinner } from '../progress';

describe('ProgressSpinner', () => {
  let progressSpinner: ProgressSpinner;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockStdout: any;

  beforeEach(() => {
    progressSpinner = new ProgressSpinner();
    mockStdout = vi.fn();
    vi.spyOn(process.stdout, 'write').mockImplementation(mockStdout);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('start', () => {
    it('should start the spinner with the given message', () => {
      progressSpinner.start('Loading...');

      vi.advanceTimersByTime(80);

      expect(mockStdout).toHaveBeenCalledWith(
        expect.stringContaining('⠋ Loading...')
      );
    });

    it('should cycle through spinner characters', () => {
      progressSpinner.start('Processing...');

      vi.advanceTimersByTime(80);
      expect(mockStdout).toHaveBeenCalledWith(
        expect.stringContaining('⠋ Processing...')
      );

      vi.advanceTimersByTime(80);
      expect(mockStdout).toHaveBeenCalledWith(
        expect.stringContaining('⠙ Processing...')
      );
    });

    it('should loop back to the first spinner character', () => {
      progressSpinner.start('Working...');

      vi.advanceTimersByTime(80 * 10);

      expect(mockStdout).toHaveBeenCalledWith(
        expect.stringContaining('⠋ Working...')
      );
    });
  });

  describe('updateMessage', () => {
    it('should update the displayed message', () => {
      progressSpinner.start('Initial message');
      progressSpinner.updateMessage('Updated message');

      vi.advanceTimersByTime(80);

      expect(mockStdout).toHaveBeenCalledWith(
        expect.stringContaining('⠋ Updated message')
      );
    });
  });

  describe('stop', () => {
    it('should clear the spinner and stop the interval', () => {
      progressSpinner.start('Loading...');
      progressSpinner.stop();

      expect(mockStdout).toHaveBeenCalledWith('\r' + ' '.repeat(50) + '\r');

      vi.advanceTimersByTime(80);

      expect(mockStdout).not.toHaveBeenCalledWith(
        expect.stringContaining('⠙ Loading...')
      );
    });

    it('should handle multiple stop calls gracefully', () => {
      progressSpinner.start('Loading...');
      progressSpinner.stop();
      progressSpinner.stop();

      expect(mockStdout).toHaveBeenCalledWith('\r' + ' '.repeat(50) + '\r');
    });
  });

  describe('integration', () => {
    it('should work with a complete start-update-stop cycle', () => {
      progressSpinner.start('Starting...');

      vi.advanceTimersByTime(80);
      expect(mockStdout).toHaveBeenCalledWith(
        expect.stringContaining('⠋ Starting...')
      );

      vi.advanceTimersByTime(80);
      expect(mockStdout).toHaveBeenCalledWith(
        expect.stringContaining('⠙ Starting...')
      );

      progressSpinner.updateMessage('Processing...');
      vi.advanceTimersByTime(80);
      expect(mockStdout).toHaveBeenCalledWith(
        expect.stringContaining('⠹ Processing...')
      );

      progressSpinner.stop();
      expect(mockStdout).toHaveBeenCalledWith('\r' + ' '.repeat(50) + '\r');
    });
  });
});
