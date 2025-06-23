import chalk from 'chalk';
import { parseVersion } from './parseVersion';

/**
 * Determines the type of update required based on the current and latest versions
 * @param current - The current version string
 * @param latest - The latest version string
 * @returns The type of update required ('patch', 'minor', or 'major')
 */
export function getUpdateType(
  current: string,
  latest: string
): 'patch' | 'minor' | 'major' {
  try {
    const currentVersion = parseVersion(current);
    const latestVersion = parseVersion(latest);

    if (latestVersion.major > currentVersion.major) {
      return 'major';
    }
    if (latestVersion.minor > currentVersion.minor) {
      return 'minor';
    }
    if (latestVersion.patch > currentVersion.patch) {
      return 'patch';
    }
    return 'patch';
  } catch (error) {
    // Handle invalid version formats gracefully
    console.warn(chalk.yellow(`⚠️  Invalid version format: ${error}`));
    return 'patch'; // Default fallback
  }
}
