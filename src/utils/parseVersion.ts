import { VersionInfo } from '../types';

/**
 * Parses a version string and returns a VersionInfo object
 * @param version - The version string to parse
 * @returns A VersionInfo object containing the major, minor, and patch versions
 */
export function parseVersion(version: string): VersionInfo {
  // Handle version ranges like ^3.3.1, ~3.3.1, >=3.3.1, etc.
  const cleanVersion = version.replace(/^[\^~>=<]+/, '');
  const match = cleanVersion.match(/^(\d+)\.(\d+)\.(\d+)/);

  if (!match) {
    // Instead of returning zeros, throw an error for invalid versions
    throw new Error(
      `Invalid version format: ${version}. Expected format: x.y.z`
    );
  }

  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
  };
}
