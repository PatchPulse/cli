import chalk from 'chalk';
import { VERSION } from '../gen/version.gen';
import { NpmPackageInfo } from '../types';
import { displayUpdateAvailable } from '../utils/ui';
import { packageCache } from './cache';

export async function getLatestVersion(
  packageName: string
): Promise<string | undefined> {
  // Check cache first
  const cached = packageCache.get(packageName);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(`https://registry.npmjs.org/${packageName}`, {
      headers: {
        'User-Agent': 'patch-pulse-cli/2.0.1',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        /**
         * Returning undefined for not found packages
         * - will be handled in display logic
         */
        return undefined;
      }
      if (response.status === 429) {
        console.warn(
          chalk.yellow(`⚠️  Rate limited by npm registry for "${packageName}"`)
        );
        return undefined;
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = (await response.json()) as NpmPackageInfo;
    const latestVersion = data['dist-tags'].latest;

    // Cache the result
    if (latestVersion) {
      packageCache.set(packageName, latestVersion);
    }

    return latestVersion;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.warn(
        chalk.yellow(
          `⚠️  Network error fetching "${packageName}": No internet connection`
        )
      );
    } else {
      console.warn(
        chalk.yellow(
          `⚠️  Failed to fetch latest version for "${packageName}": ${error}`
        )
      );
    }
    return undefined;
  }
}

export async function checkForCliUpdate(): Promise<void> {
  try {
    // Check cache first
    const cachedLatestVersion = packageCache.get('patch-pulse');
    if (cachedLatestVersion && cachedLatestVersion !== VERSION) {
      displayUpdateAvailable(VERSION, cachedLatestVersion);
      return;
    }

    const response = await fetch('https://registry.npmjs.org/patch-pulse', {
      headers: {
        'User-Agent': `patch-pulse-cli/${VERSION}`,
      },
    });

    if (response.ok) {
      const data = (await response.json()) as NpmPackageInfo;
      const latestVersion = data['dist-tags'].latest;

      // Cache the result
      packageCache.set('patch-pulse', latestVersion);

      if (latestVersion !== VERSION) {
        displayUpdateAvailable(VERSION, latestVersion);
      }
    } else if (response.status === 429) {
      // Rate limited - don't show error, just skip update check
      return;
    }
  } catch (error) {
    // Only log network errors, not other issues
    if (error instanceof TypeError && error.message.includes('fetch')) {
      // Network error - silently fail
      return;
    }
    // Other errors - silently fail
  }
}
