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

/**
 * Preserves the wildcard prefix from the current version when updating to the latest version
 * @param currentVersion - The current version string (e.g., "^3.3.1", "~2.1.0")
 * @param latestVersion - The latest version string (e.g., "3.3.2")
 * @returns The latest version with the original wildcard prefix preserved
 */
export function preserveWildcardPrefix(
  currentVersion: string,
  latestVersion: string
): string {
  // Extract the wildcard prefix from the current version
  const wildcardMatch = currentVersion.match(/^([\^~>=<]+)/);
  const wildcardPrefix = wildcardMatch ? wildcardMatch[1] : '';

  // Return the latest version with the original wildcard prefix
  return wildcardPrefix + latestVersion;
}

/**
 * Checks if a version string has wildcard prefixes
 * @param version - The version string to check
 * @returns True if the version has wildcard prefixes, false otherwise
 */
export function hasWildcardPrefix(version: string): boolean {
  return /^[\^~>=<]+/.test(version);
}
