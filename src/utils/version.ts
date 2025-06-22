import chalk from 'chalk';
import { VersionInfo } from '../types';

export function parseVersion(version: string): VersionInfo {
  // Handle version ranges like ^3.3.1, ~3.3.1, >=3.3.1, etc.
  const cleanVersion = version.replace(/^[\^~>=<]+/, '');
  const match = cleanVersion.match(/^(\d+)\.(\d+)\.(\d+)/);

  if (!match) {
    // Instead of returning zeros, throw an error for invalid versions
    throw new Error(`Invalid version format: ${version}`);
  }

  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
  };
}

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

export function isVersionOutdated(current: string, latest: string): boolean {
  try {
    const currentVersion = parseVersion(current);
    const latestVersion = parseVersion(latest);

    return (
      latestVersion.major > currentVersion.major ||
      latestVersion.minor > currentVersion.minor ||
      latestVersion.patch > currentVersion.patch
    );
  } catch (error) {
    // Handle invalid version formats gracefully
    console.warn(chalk.yellow(`⚠️  Invalid version format: ${error}`));
    return false; // Default to not outdated if we can't parse
  }
}
