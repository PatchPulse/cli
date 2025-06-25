import chalk from 'chalk';
import { UpdateType } from '../types';
import { parseVersion } from './parseVersion';

interface GetUpdateTypeArgs {
  /**
   * The current version string
   */
  current: string;
  /**
   * The latest version string
   */
  latest: string;
}

/**
 * Determines the type of update required based on the current and latest versions
 * @returns The type of update required ('patch', 'minor', or 'major')
 */
export function getUpdateType({
  current,
  latest,
}: GetUpdateTypeArgs): UpdateType {
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
  } catch {
    // Handle invalid version formats gracefully
    console.warn(
      chalk.yellow(
        `⚠️  Invalid version format: ${current} or ${latest}. Defaulting to patch update.`
      )
    );
    return 'patch';
  }
}
