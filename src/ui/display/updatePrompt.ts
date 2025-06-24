import chalk from 'chalk';
import { type PackageManagerInfo } from '../../services/package-manager';
import { type DependencyInfo } from '../../types';
import { pluralize } from '../../utils/pluralize';
import { displayHelp } from './help';
import { displayVersion } from './version';

export interface UpdateOptions {
  patch: Array<{ packageName: string; latestVersion: string }>;
  minor: Array<{ packageName: string; latestVersion: string }>;
  all: Array<{ packageName: string; latestVersion: string }>;
}

/**
 * Displays the interactive update prompt after the summary
 * @param dependencies - Array of outdated dependencies
 * @param packageManager - The detected package manager
 * @returns Promise that resolves with the selected update type or null if cancelled
 */
export function displayUpdatePrompt(
  dependencies: DependencyInfo[],
  packageManager: PackageManagerInfo
): Promise<'patch' | 'minor' | 'all' | null> {
  return new Promise(resolve => {
    const outdatedDeps = dependencies.filter(d => d.isOutdated && !d.isSkipped);

    if (outdatedDeps.length === 0) {
      resolve(null);
      return;
    }

    const updateOptions = categorizeUpdates(outdatedDeps);

    function showOptions() {
      // Count how many different types of updates we have
      const hasPatch = updateOptions.patch.length > 0;
      const hasMinor = updateOptions.minor.length > 0;
      const hasMajor =
        updateOptions.all.length >
        updateOptions.patch.length + updateOptions.minor.length;
      const updateTypesCount = [hasPatch, hasMinor, hasMajor].filter(
        Boolean
      ).length;

      // Show individual options
      if (updateOptions.patch.length > 0) {
        console.log(
          `  ${chalk.cyan('p')} - Update ${pluralize(updateOptions.patch.length, 'outdated patch dependency', 'outdated patch dependencies')}`
        );
      }
      if (updateOptions.minor.length > 0) {
        console.log(
          `  ${chalk.cyan('m')} - Update ${pluralize(updateOptions.minor.length, 'outdated minor dependency', 'outdated minor dependencies')}`
        );
      }

      // Show "all" option if there are multiple types OR if there are only major updates
      if (
        updateOptions.all.length > 0 &&
        (updateTypesCount > 1 || (!hasPatch && !hasMinor && hasMajor))
      ) {
        const allText =
          updateOptions.all.length === 1
            ? `Update ${updateOptions.all.length} ${pluralize(updateOptions.all.length, 'outdated dependency', 'outdated dependencies')}`
            : `Update all ${updateOptions.all.length} ${pluralize(updateOptions.all.length, 'outdated dependency', 'outdated dependencies')}`;

        console.log(`  ${chalk.cyan('a')} - ${allText}`);
      }

      console.log();
      console.log(
        `  ${chalk.gray('h')} - Show help | ${chalk.gray('v')} - Show version | ${chalk.gray('q')} - Quit`
      );
      console.log();
      console.log(chalk.white('Press a key to select an option...'));
    }

    showOptions();

    // Set up raw mode for single key press detection
    const stdin = process.stdin;

    // Save current terminal settings
    const wasRaw = stdin.isRaw;
    const wasPaused = stdin.isPaused();

    // Set up raw mode
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');

    const handleKeyPress = (key: string) => {
      const choice = key.toLowerCase();

      switch (choice) {
        case 'p':
          if (updateOptions.patch.length > 0) {
            cleanup();
            resolve('patch');
          } else {
            console.log(chalk.red('\nNo patch updates available'));
          }
          break;
        case 'm':
          if (updateOptions.minor.length > 0) {
            cleanup();
            resolve('minor');
          } else {
            console.log(chalk.red('\nNo minor updates available'));
          }
          break;
        case 'a':
          if (updateOptions.all.length > 0) {
            cleanup();
            resolve('all');
          } else {
            console.log(chalk.red('\nNo updates available'));
          }
          break;
        case 'q':
          cleanup();
          resolve(null);
          break;
        case 'h':
          cleanup();
          displayHelp();
          console.log();
          // Re-display the options and continue
          showOptions();
          // Re-setup the key listener
          stdin.setRawMode(true);
          stdin.resume();
          stdin.setEncoding('utf8');
          stdin.on('data', handleKeyPress);
          break;
        case 'v':
          cleanup();
          displayVersion();
          console.log();
          // Re-display the options and continue
          showOptions();
          // Re-setup the key listener
          stdin.setRawMode(true);
          stdin.resume();
          stdin.setEncoding('utf8');
          stdin.on('data', handleKeyPress);
          break;
        case '\u0003': // Ctrl+C
          cleanup();
          resolve(null);
          break;
        default:
          // Ignore other keys
          break;
      }
    };

    const cleanup = () => {
      stdin.setRawMode(wasRaw);
      if (wasPaused) {
        stdin.pause();
      }
      stdin.removeListener('data', handleKeyPress);
    };

    stdin.on('data', handleKeyPress);
  });
}

/**
 * Categorizes dependencies by update type
 * @param dependencies - Array of outdated dependencies
 * @returns Object with categorized dependencies
 */
function categorizeUpdates(dependencies: DependencyInfo[]): UpdateOptions {
  const patch: Array<{ packageName: string; latestVersion: string }> = [];
  const minor: Array<{ packageName: string; latestVersion: string }> = [];
  const all: Array<{ packageName: string; latestVersion: string }> = [];

  for (const dep of dependencies) {
    if (!dep.latestVersion) continue;

    const updateEntry = {
      packageName: dep.packageName,
      latestVersion: dep.latestVersion,
    };

    all.push(updateEntry);

    if (dep.updateType === 'patch') {
      patch.push(updateEntry);
    } else if (dep.updateType === 'minor') {
      minor.push(updateEntry);
    }
    // Major updates are not included in patch or minor categories
  }

  return { patch, minor, all };
}
