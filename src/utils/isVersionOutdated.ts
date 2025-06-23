import chalk from 'chalk';
import { parseVersion } from './parseVersion';

/**
 * Checks if the current version is outdated compared to the latest version
 * @param current - The current version string
 * @param latest - The latest version string
 * @returns True if the current version is outdated, false otherwise
 */
export function isVersionOutdated(current: string, latest: string): boolean {
  try {
    const currentVersion = parseVersion(current);
    const latestVersion = parseVersion(latest);

    // Compare major versions first
    if (latestVersion.major > currentVersion.major) {
      return true;
    }
    if (latestVersion.major < currentVersion.major) {
      return false;
    }

    // If major versions are equal, compare minor versions
    if (latestVersion.minor > currentVersion.minor) {
      return true;
    }
    if (latestVersion.minor < currentVersion.minor) {
      return false;
    }

    // If minor versions are equal, compare patch versions
    return latestVersion.patch > currentVersion.patch;
  } catch (error) {
    // Handle invalid version formats gracefully
    console.warn(chalk.yellow(`⚠️  Invalid version format: ${error}`));
    return false; // Default to not outdated if we can't parse
  }
}
