import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  mergeConfigs,
  parseCliConfig,
  readConfigFile,
  shouldSkipPackage,
  type CliConfig,
  type MergedConfig,
  type PatchPulseConfig,
} from '../config';

vi.mock('fs', () => ({
  readFileSync: vi.fn(),
  existsSync: vi.fn(),
}));

vi.mock('path', () => ({
  join: vi.fn(),
}));

describe('Configuration Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('readConfigFile', () => {
    it('should return null when no config file exists', () => {
      vi.mocked(existsSync).mockReturnValue(false);
      vi.mocked(join).mockReturnValue('/test/.patchpulse.config.json');

      const result = readConfigFile('/test');

      expect(result).toBeNull();
    });

    it('should read and parse .patchpulse.config.json file', () => {
      const mockConfig = {
        skip: ['lodash', 'express', '@types/*', 'test-*'],
      };

      vi.mocked(existsSync).mockReturnValue(true);
      vi.mocked(join).mockReturnValue('/test/.patchpulse.config.json');
      vi.mocked(readFileSync).mockReturnValue(JSON.stringify(mockConfig));

      const result = readConfigFile('/test');

      expect(result).toEqual(mockConfig);
    });

    it('should handle invalid JSON gracefully', () => {
      vi.mocked(existsSync).mockReturnValue(true);
      vi.mocked(join).mockReturnValue('/test/.patchpulse.config.json');
      vi.mocked(readFileSync).mockReturnValue('invalid json');

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const result = readConfigFile('/test');

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching(
          /Warning: Could not parse \.patchpulse.config.json: SyntaxError: Unexpected token/
        )
      );

      consoleSpy.mockRestore();
    });
  });

  describe('parseCliConfig', () => {
    it('should parse --skip argument', () => {
      const args = ['--skip', 'lodash,express,chalk,@types/*'];
      const result = parseCliConfig(args);

      expect(result).toEqual({
        skip: ['lodash', 'express', 'chalk', '@types/*'],
      });
    });

    it('should parse -s argument', () => {
      const args = ['-s', 'lodash,express,chalk,@types/*'];
      const result = parseCliConfig(args);

      expect(result).toEqual({
        skip: ['lodash', 'express', 'chalk', '@types/*'],
      });
    });

    it('should ignore arguments that start with dash', () => {
      const args = ['--skip', '--help'];
      const result = parseCliConfig(args);

      expect(result).toEqual({});
    });

    it('should ignore arguments that start with dash for short flag', () => {
      const args = ['-s', '--help'];
      const result = parseCliConfig(args);

      expect(result).toEqual({});
    });
  });

  describe('mergeConfigs', () => {
    it('should merge file and CLI configs', () => {
      const fileConfig: PatchPulseConfig = {
        skip: ['lodash', '@types/*'],
      };

      const cliConfig: CliConfig = {
        skip: ['express', 'test-*'],
      };

      const result = mergeConfigs(fileConfig, cliConfig);

      expect(result).toEqual({
        skip: ['express', 'test-*'],
      });
    });

    it('should handle null file config', () => {
      const cliConfig: CliConfig = {
        skip: ['express', 'test-*'],
      };

      const result = mergeConfigs(null, cliConfig);

      expect(result).toEqual({
        skip: ['express', 'test-*'],
      });
    });

    it('should handle empty CLI config', () => {
      const fileConfig: PatchPulseConfig = {
        skip: ['lodash', '@types/*'],
      };

      const result = mergeConfigs(fileConfig, {});

      expect(result).toEqual({
        skip: ['lodash', '@types/*'],
      });
    });
  });

  describe('shouldSkipPackage', () => {
    it('should skip exact matches', () => {
      const config: MergedConfig = {
        skip: ['lodash', 'express'],
      };

      expect(shouldSkipPackage('lodash', config)).toBe(true);
      expect(shouldSkipPackage('express', config)).toBe(true);
      expect(shouldSkipPackage('chalk', config)).toBe(false);
    });

    it('should skip packages matching patterns', () => {
      const config: MergedConfig = {
        skip: ['@types/*', 'test-*'],
      };

      expect(shouldSkipPackage('@types/node', config)).toBe(true);
      expect(shouldSkipPackage('test-utils', config)).toBe(true);
      expect(shouldSkipPackage('@typescript-eslint/parser', config)).toBe(
        false
      );
      expect(shouldSkipPackage('chalk', config)).toBe(false);
    });

    it('should handle invalid regex patterns gracefully', () => {
      const config: MergedConfig = {
        skip: ['[invalid-regex'],
      };

      expect(shouldSkipPackage('test-package', config)).toBe(false);
    });

    it('should check both exact matches and patterns', () => {
      const config: MergedConfig = {
        skip: ['lodash', '@types/*'],
      };

      expect(shouldSkipPackage('lodash', config)).toBe(true);
      expect(shouldSkipPackage('@types/node', config)).toBe(true);
      expect(shouldSkipPackage('chalk', config)).toBe(false);
    });

    it('should treat patterns without regex chars as exact matches', () => {
      const config: MergedConfig = {
        skip: ['lodash', 'test-package'],
      };

      expect(shouldSkipPackage('lodash', config)).toBe(true);
      expect(shouldSkipPackage('test-package', config)).toBe(true);
      expect(shouldSkipPackage('test-package-extra', config)).toBe(false);
    });
  });
});
