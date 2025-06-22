import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

export interface PatchPulseConfig {
  skip?: string[];
}

export interface CliConfig {
  skip?: string[];
}

export interface MergedConfig {
  skip: string[];
}

const CONFIG_FILENAMES = [
  '.patchpulserc',
  '.patchpulserc.json',
  'patchpulse.config.json',
];

/**
 * Reads configuration from .patchpulserc file
 * @param cwd - The current working directory
 * @returns The configuration from the file
 */
export function readConfigFile(
  cwd: string = process.cwd()
): PatchPulseConfig | null {
  for (const filename of CONFIG_FILENAMES) {
    const configPath = join(cwd, filename);
    if (existsSync(configPath)) {
      try {
        const content = readFileSync(configPath, 'utf-8');
        const config = JSON.parse(content);
        return validateConfig(config);
      } catch (error) {
        console.warn(`Warning: Could not parse ${filename}: ${error}`);
        return null;
      }
    }
  }
  return null;
}

/**
 * Parses CLI arguments for configuration options
 * @param args - The command line arguments
 * @returns The parsed configuration
 */
export function parseCliConfig(args: string[]): CliConfig {
  const config: CliConfig = {};

  const skipIndex = args.indexOf('--skip');
  const shortSkipIndex = args.indexOf('-s');
  const skipArgIndex = skipIndex !== -1 ? skipIndex : shortSkipIndex;

  if (skipArgIndex !== -1 && skipArgIndex + 1 < args.length) {
    const skipValue = args[skipArgIndex + 1];
    if (!skipValue.startsWith('-')) {
      config.skip = skipValue
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
    }
  }

  return config;
}

/**
 * Merges file config and CLI config, with CLI taking precedence
 * @param fileConfig - The configuration from the file
 * @param cliConfig - The configuration from the CLI
 * @returns The merged configuration
 */
export function mergeConfigs(
  fileConfig: PatchPulseConfig | null,
  cliConfig: CliConfig
): MergedConfig {
  const merged: MergedConfig = {
    skip: [],
  };

  // Add file config values
  if (fileConfig?.skip) {
    merged.skip.push(...fileConfig.skip);
  }

  // CLI config overrides file config
  if (cliConfig.skip) {
    merged.skip = cliConfig.skip;
  }

  return merged;
}

/**
 * Validates configuration object
 * @param config - The configuration to validate
 * @returns The validated configuration
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validateConfig(config: any): PatchPulseConfig {
  const validated: PatchPulseConfig = {};

  if (config.skip && Array.isArray(config.skip)) {
    validated.skip = config.skip.filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (item: any) => typeof item === 'string'
    );
  }

  return validated;
}

/**
 * Checks if a package should be skipped based on configuration
 * @param packageName - The name of the package to check
 * @param config - The configuration to use
 * @returns True if the package should be skipped, false otherwise
 */
export function shouldSkipPackage(
  packageName: string,
  config: MergedConfig
): boolean {
  return config.skip.some(pattern => {
    // If the pattern contains regex special characters (other than * and ?), treat as regex
    if (/[. +?^${}()|[\]]/.test(pattern.replace(['*', '?'].join('|'), ''))) {
      try {
        const regex = new RegExp(pattern);
        return regex.test(packageName);
      } catch {
        return packageName.includes(pattern);
      }
    } else if (pattern.includes('*') || pattern.includes('?')) {
      // Convert glob to regex
      const regexPattern =
        '^' +
        pattern
          .replace(/([.+^${}()|[\\]])/g, '\\$1') // Escape regex special chars
          .replace(/\*/g, '.*') // * => .*
          .replace(/\?/g, '.') + // ? => .
        '$';
      const regex = new RegExp(regexPattern);
      return regex.test(packageName);
    } else {
      return packageName === pattern;
    }
  });
}
