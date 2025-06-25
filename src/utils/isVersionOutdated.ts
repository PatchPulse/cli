import { parseVersion } from './parseVersion';

interface IsVersionOutdatedArgs {
  /**
   * The current version string
   */
  current: string;
  /**
   * The latest version string to compare against
   */
  latest: string;
}

/**
 * Checks if the current version is outdated compared to the latest version
 * @returns True if the current version is outdated, false otherwise
 */
export function isVersionOutdated({
  current,
  latest,
}: IsVersionOutdatedArgs): boolean {
  try {
    const currentVersion = parseVersion(current);
    const latestVersion = parseVersion(latest);

    // Compare major, minor, and patch versions
    if (latestVersion.major > currentVersion.major) return true;
    if (latestVersion.major < currentVersion.major) return false;
    if (latestVersion.minor > currentVersion.minor) return true;
    if (latestVersion.minor < currentVersion.minor) return false;
    return latestVersion.patch > currentVersion.patch;
  } catch {
    // If version parsing fails, assume it's not outdated
    return false;
  }
}
