import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { type PackageManager } from './package-manager';

export interface PatchPulseConfig {
  skip?: string[];
  packageManager?: PackageManager;
  noUpdatePrompt?: boolean;
}

const CONFIG_FILENAMES = [
  'patchpulse.config.json',
  '.patchpulserc.json',
  '.patchpulserc',
];

/**
 * Get the config from the config file and merged with the CLI config
 * @param argv - The command line arguments
 * @returns The merged configuration
 */
export function getConfig() {
  const fileConfig = readConfigFile();
  const cliConfig = parseCliConfig(process.argv.slice(2));
  return mergeConfigs(fileConfig, cliConfig);
}

/**
 * Reads configuration from patchpulse.config.json file
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
export function parseCliConfig(args: string[]): PatchPulseConfig {
  const config: PatchPulseConfig = {};

  // Parse skip argument
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

  // Parse package manager argument
  const packageManagerIndex = args.indexOf('--package-manager');
  if (packageManagerIndex !== -1 && packageManagerIndex + 1 < args.length) {
    const packageManagerValue = args[packageManagerIndex + 1];
    if (!packageManagerValue.startsWith('-')) {
      if (['npm', 'pnpm', 'yarn', 'bun'].includes(packageManagerValue)) {
        config.packageManager = packageManagerValue as any;
      }
    }
  }

  // Parse no update prompt argument
  if (args.includes('--no-update-prompt')) {
    config.noUpdatePrompt = true;
  }
  // Parse update prompt argument (overrides noUpdatePrompt)
  if (args.includes('--update-prompt')) {
    config.noUpdatePrompt = false;
  }

  return config;
}

/**
 * Merges file config and CLI config, combining skip arrays from both sources
 * @param fileConfig - The configuration from the file
 * @param cliConfig - The configuration from the CLI
 * @returns The merged configuration
 */
export function mergeConfigs(
  fileConfig: PatchPulseConfig | null,
  cliConfig: PatchPulseConfig
): PatchPulseConfig {
  const merged: PatchPulseConfig = {
    skip: [],
  };

  // Add file config values
  if (fileConfig?.skip) {
    merged.skip!.push(...fileConfig.skip);
  }

  // Add CLI config values (merge instead of override)
  if (cliConfig.skip) {
    merged.skip!.push(...cliConfig.skip);
  }

  // Remove duplicates while preserving order
  merged.skip = [...new Set(merged.skip!)];

  // Handle packageManager (CLI takes precedence)
  if (cliConfig.packageManager) {
    merged.packageManager = cliConfig.packageManager;
  } else if (fileConfig?.packageManager) {
    merged.packageManager = fileConfig.packageManager;
  }

  // Handle noUpdatePrompt (CLI takes precedence)
  if (cliConfig.noUpdatePrompt !== undefined) {
    merged.noUpdatePrompt = cliConfig.noUpdatePrompt;
  } else if (fileConfig?.noUpdatePrompt !== undefined) {
    merged.noUpdatePrompt = fileConfig.noUpdatePrompt;
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

  if (typeof config.packageManager === 'string') {
    validated.packageManager = config.packageManager;
  }

  if (typeof config.noUpdatePrompt === 'boolean') {
    validated.noUpdatePrompt = config.noUpdatePrompt;
  }

  return validated;
}

/**
 * Checks if a package should be skipped based on configuration
 * @param packageName - The name of the package to check
 * @param config - The configuration to use
 * @param version - The version of the package to check
 * @returns True if the package should be skipped, false otherwise
 */
export function shouldSkipPackage({
  packageName,
  config = {},
}: {
  packageName: string;
  config: PatchPulseConfig | undefined;
}): boolean {
  if (!config.skip) {
    return false;
  }

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
