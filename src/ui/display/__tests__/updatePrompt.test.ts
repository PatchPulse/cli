import { beforeEach, describe, expect, it, vi } from 'vitest';
import { type DependencyInfo } from '../../../types';
import { displayUpdatePrompt } from '../updatePrompt';

// Mock process.stdin
const mockStdin = {
  setRawMode: vi.fn(),
  resume: vi.fn(),
  setEncoding: vi.fn(),
  on: vi.fn(),
  removeListener: vi.fn(),
  isRaw: false,
  isPaused: vi.fn(() => false),
  pause: vi.fn(),
  isTTY: true, // Mock TTY environment
};

// Stub the global process.stdin
vi.stubGlobal('process', {
  stdin: mockStdin,
});

describe('updatePrompt', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Ensure TTY is true by default for tests
    mockStdin.isTTY = true;
  });

  it('should return null when no outdated dependencies', async () => {
    const dependencies: DependencyInfo[] = [
      {
        packageName: 'test-package',
        currentVersion: '1.0.0',
        latestVersion: '1.0.0',
        isOutdated: false,
      },
    ];

    const result = await displayUpdatePrompt(dependencies);
    expect(result).toBeNull();
  });

  it('should return null when noUpdatePrompt config is true', async () => {
    const dependencies: DependencyInfo[] = [
      {
        packageName: 'test-package',
        currentVersion: '1.0.0',
        latestVersion: '1.0.1',
        isOutdated: true,
        updateType: 'patch',
      },
    ];

    const result = await displayUpdatePrompt(dependencies, {
      noUpdatePrompt: true,
    });
    expect(result).toBeNull();
  });

  it('should return null when not in TTY environment', async () => {
    const dependencies: DependencyInfo[] = [
      {
        packageName: 'test-package',
        currentVersion: '1.0.0',
        latestVersion: '1.0.1',
        isOutdated: true,
        updateType: 'patch',
      },
    ];

    // Mock non-TTY environment
    mockStdin.isTTY = false;

    const result = await displayUpdatePrompt(dependencies);
    expect(result).toBeNull();
  });

  it('should show patch update option when patch dependencies exist', async () => {
    const dependencies: DependencyInfo[] = [
      {
        packageName: 'test-package',
        currentVersion: '1.0.0',
        latestVersion: '1.0.1',
        isOutdated: true,
        updateType: 'patch',
      },
    ];

    // Mock the stdin.on to capture the callback and simulate key press
    let keyPressCallback: ((key: string) => void) | undefined;
    mockStdin.on.mockImplementation((event, callback) => {
      if (event === 'data') {
        keyPressCallback = callback;
      }
    });

    // Start the promise
    const promise = displayUpdatePrompt(dependencies);

    // Wait a bit for the function to set up, then simulate pressing 'p' key
    await new Promise(resolve => setTimeout(resolve, 10));
    if (keyPressCallback) {
      keyPressCallback('p');
    }

    const result = await promise;
    expect(result).toBe('patch');
    expect(mockStdin.setRawMode).toHaveBeenCalledWith(true);
    expect(mockStdin.resume).toHaveBeenCalled();
    expect(mockStdin.setEncoding).toHaveBeenCalledWith('utf8');
  });
});
