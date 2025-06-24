import { existsSync } from 'fs';
import { join } from 'path';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  detectPackageManager,
  getPackageManagerInfo,
} from '../package-manager';

// Mock fs module
vi.mock('fs', () => ({
  existsSync: vi.fn(),
}));

// Mock path module
vi.mock('path', () => ({
  join: vi.fn(),
}));

describe('package-manager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('detectPackageManager', () => {
    it('should detect npm when package-lock.json exists', () => {
      const mockExistsSync = vi.mocked(existsSync);
      const mockJoin = vi.mocked(join);

      mockJoin.mockImplementation((dir: string, file: string) => {
        return `${dir}/${file}`;
      });
      mockExistsSync.mockImplementation((path: any) => {
        return path === '/test/package-lock.json';
      });

      const result = detectPackageManager('/test');

      expect(result).toEqual({
        name: 'npm',
        lockFiles: ['package-lock.json'],
        addCommand: 'npm install',
      });
    });

    it('should detect pnpm when pnpm-lock.yaml exists', () => {
      const mockExistsSync = vi.mocked(existsSync);
      const mockJoin = vi.mocked(join);

      mockJoin.mockImplementation((dir: string, file: string) => {
        return `${dir}/${file}`;
      });
      mockExistsSync.mockImplementation((path: any) => {
        return path === '/test/pnpm-lock.yaml';
      });

      const result = detectPackageManager('/test');

      expect(result).toEqual({
        name: 'pnpm',
        lockFiles: ['pnpm-lock.yaml'],
        addCommand: 'pnpm add',
      });
    });

    it('should detect yarn when yarn.lock exists', () => {
      const mockExistsSync = vi.mocked(existsSync);
      const mockJoin = vi.mocked(join);

      mockJoin.mockImplementation((dir: string, file: string) => {
        return `${dir}/${file}`;
      });
      mockExistsSync.mockImplementation((path: any) => {
        return path === '/test/yarn.lock';
      });

      const result = detectPackageManager('/test');

      expect(result).toEqual({
        name: 'yarn',
        lockFiles: ['yarn.lock'],
        addCommand: 'yarn add',
      });
    });

    it('should detect bun when bun.lockb exists', () => {
      const mockExistsSync = vi.mocked(existsSync);
      const mockJoin = vi.mocked(join);

      mockJoin.mockImplementation((dir: string, file: string) => {
        return `${dir}/${file}`;
      });
      mockExistsSync.mockImplementation((path: any) => {
        return path === '/test/bun.lockb';
      });

      const result = detectPackageManager('/test');

      expect(result).toEqual({
        name: 'bun',
        lockFiles: ['bun.lock', 'bun.lockb'],
        addCommand: 'bun add',
      });
    });

    it('should return npm as default when no lock file exists', () => {
      const mockExistsSync = vi.mocked(existsSync);
      const mockJoin = vi.mocked(join);

      mockJoin.mockReturnValue('/test/nonexistent');
      mockExistsSync.mockReturnValue(false);

      const result = detectPackageManager('/test');

      expect(result).toEqual({
        name: 'npm',
        lockFiles: ['package-lock.json'],
        addCommand: 'npm install',
      });
    });
  });

  describe('getPackageManagerInfo', () => {
    it('should return npm info', () => {
      const result = getPackageManagerInfo('npm');

      expect(result).toEqual({
        name: 'npm',
        lockFiles: ['package-lock.json'],
        addCommand: 'npm install',
      });
    });

    it('should return pnpm info', () => {
      const result = getPackageManagerInfo('pnpm');

      expect(result).toEqual({
        name: 'pnpm',
        lockFiles: ['pnpm-lock.yaml'],
        addCommand: 'pnpm add',
      });
    });

    it('should return yarn info', () => {
      const result = getPackageManagerInfo('yarn');

      expect(result).toEqual({
        name: 'yarn',
        lockFiles: ['yarn.lock'],
        addCommand: 'yarn add',
      });
    });

    it('should return bun info', () => {
      const result = getPackageManagerInfo('bun');

      expect(result).toEqual({
        name: 'bun',
        lockFiles: ['bun.lock', 'bun.lockb'],
        addCommand: 'bun add',
      });
    });
  });
});
