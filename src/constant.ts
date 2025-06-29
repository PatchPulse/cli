import { type PackageManager } from './types';

/**
 * The package managers that PatchPulse supports.
 * Used for running the command to update the dependencies.
 */
export const PACKAGE_MANAGERS: readonly PackageManager[] = [
  'npm',
  'pnpm',
  'yarn',
  'bun',
];

/**
 * The filenames of the configuration files that PatchPulse looks for.
 */
export const CONFIG_FILENAMES: readonly string[] = [
  'patchpulse.config.json',
  '.patchpulserc.json',
  '.patchpulserc',
];
