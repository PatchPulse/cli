import { existsSync, readFileSync } from 'fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { readPackageJson } from '../package';

// Mock fs module
vi.mock('fs', () => ({
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
}));

describe('readPackageJson', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should read and parse valid package.json', async () => {
    const mockPackageJson = {
      name: 'test-package',
      version: '1.0.0',
      dependencies: { chalk: '^5.0.0' },
    };

    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(readFileSync).mockReturnValue(JSON.stringify(mockPackageJson));

    const result = await readPackageJson('/path/to/package.json');

    expect(result).toEqual(mockPackageJson);
    expect(existsSync).toHaveBeenCalledWith('/path/to/package.json');
    expect(readFileSync).toHaveBeenCalledWith('/path/to/package.json', 'utf-8');
  });

  it('should throw error when file does not exist', async () => {
    vi.mocked(existsSync).mockReturnValue(false);

    await expect(readPackageJson('/nonexistent/package.json')).rejects.toThrow(
      'package.json not found at /nonexistent/package.json'
    );
  });

  it('should throw error for invalid JSON', async () => {
    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(readFileSync).mockReturnValue('invalid json');

    await expect(readPackageJson('/path/to/package.json')).rejects.toThrow(
      'Invalid JSON in package.json:'
    );
  });

  it('should throw error for non-object JSON', async () => {
    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(readFileSync).mockReturnValue('"string"');

    await expect(readPackageJson('/path/to/package.json')).rejects.toThrow(
      'package.json must be a valid JSON object'
    );
  });

  it('should throw error for null JSON', async () => {
    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(readFileSync).mockReturnValue('null');

    await expect(readPackageJson('/path/to/package.json')).rejects.toThrow(
      'package.json must be a valid JSON object'
    );
  });
});
