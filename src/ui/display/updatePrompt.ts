import chalk from 'chalk';
import { type PatchPulseConfig } from '../../services/config';
import { type DependencyInfo } from '../../types';
import { displayHelp } from './help';
import { displayVersion } from './version';

type UpdateType = 'patch' | 'minor' | 'all';

type OtherOption = 'help' | 'version' | 'quit';

const UPDATE_OPTION_CHARS: Record<UpdateType, string> = {
  patch: 'p',
  minor: 'm',
  all: 'u',
};

const OTHER_OPTION_CHARS: Record<OtherOption, string> = {
  help: 'h',
  version: 'v',
  quit: 'q',
};

interface UpdateOption {
  packageName: string;
  latestVersion: string;
}

export interface UpdateOptions {
  patch: UpdateOption[];
  minor: UpdateOption[];
  all: UpdateOption[];
}

/**
 * Sets up raw mode for single key press detection
 * @param stdin - The stdin stream
 * @param _wasRaw - The original raw mode state (unused but kept for consistency)
 * @param _wasPaused - The original paused state (unused but kept for consistency)
 */
function setupRawMode(stdin: typeof process.stdin) {
  // Check if stdin is a TTY before calling setRawMode
  if (stdin.isTTY) {
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
  }
}

/**
 * Restores the original terminal settings
 * @param stdin - The stdin stream
 * @param wasRaw - The original raw mode state
 * @param wasPaused - The original paused state
 */
function restoreTerminalSettings({
  stdin,
  wasRaw,
  wasPaused,
}: {
  stdin: typeof process.stdin;
  wasRaw: boolean;
  wasPaused: boolean;
}) {
  // Only call setRawMode if stdin is a TTY
  if (stdin.isTTY) {
    stdin.setRawMode(wasRaw);
    if (wasPaused) {
      stdin.pause();
    }
  }
}

/**
 * Displays the interactive update prompt after the summary
 * @param dependencies - Array of outdated dependencies
 * @param config - The configuration object
 * @returns Promise that resolves with the selected update type or null if cancelled
 */
export function displayUpdatePrompt(
  dependencies: DependencyInfo[],
  config?: PatchPulseConfig
): Promise<UpdateType | null> {
  return new Promise(resolve => {
    const outdatedDeps = dependencies.filter(d => d.isOutdated && !d.isSkipped);

    if (outdatedDeps.length === 0) {
      resolve(null);
      return;
    }

    // Check if update prompt is disabled via config
    if (config?.noUpdatePrompt) {
      resolve(null);
      return;
    }

    // Check if we're in a non-interactive environment (CI/CD)
    if (!process.stdin.isTTY) {
      console.log(
        chalk.yellow(
          '⚠️  Running in non-interactive environment. Skipping update prompt.'
        )
      );
      console.log(
        chalk.gray('Use --update-prompt flag to force interactive mode.')
      );
      resolve(null);
      return;
    }

    const updateOptions = categorizeUpdates(outdatedDeps);

    function showOptions() {
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
          `  ${chalk.cyan(UPDATE_OPTION_CHARS.patch)} - Update outdated patch dependencies`
        );
      }
      if (updateOptions.minor.length > 0) {
        console.log(
          `  ${chalk.cyan(UPDATE_OPTION_CHARS.minor)} - Update outdated minor & patch dependencies`
        );
      }

      // Show "all" option if there are multiple types OR if there are only major updates
      if (
        updateOptions.all.length > 0 &&
        (updateTypesCount > 1 || (!hasPatch && !hasMinor && hasMajor))
      ) {
        console.log(
          `  ${chalk.cyan(UPDATE_OPTION_CHARS.all)} - update all outdated dependencies`
        );
      }

      console.log();
      console.log(
        `  ${chalk.gray(OTHER_OPTION_CHARS.help)} - Show help | ${chalk.gray(
          OTHER_OPTION_CHARS.version
        )} - Show version | ${chalk.gray(OTHER_OPTION_CHARS.quit)} - Quit`
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
    setupRawMode(stdin);

    function handleKeyPress(key: string) {
      const choice = key.toLowerCase();

      switch (choice) {
        case UPDATE_OPTION_CHARS.patch:
          if (updateOptions.patch.length > 0) {
            cleanup();
            resolve('patch');
          } else {
            console.log(chalk.red('\nNo patch updates available'));
          }
          break;
        case UPDATE_OPTION_CHARS.minor:
          if (updateOptions.minor.length > 0) {
            cleanup();
            resolve('minor');
          } else {
            console.log(chalk.red('\nNo minor updates available'));
          }
          break;
        case UPDATE_OPTION_CHARS.all:
          if (updateOptions.all.length > 0) {
            cleanup();
            resolve('all');
          } else {
            console.log(chalk.red('\nNo updates available'));
          }
          break;
        case OTHER_OPTION_CHARS.quit:
          cleanup();
          resolve(null);
          break;
        case OTHER_OPTION_CHARS.help:
          cleanup();
          displayHelp();
          console.log();
          // Re-display the options and continue
          showOptions();
          // Re-setup the key listener
          setupRawMode(stdin);
          stdin.on('data', handleKeyPress);
          break;
        case OTHER_OPTION_CHARS.version:
          cleanup();
          displayVersion();
          console.log();
          // Re-display the options and continue
          showOptions();
          // Re-setup the key listener
          setupRawMode(stdin);
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
    }

    function cleanup() {
      restoreTerminalSettings({ stdin, wasRaw, wasPaused });
      stdin.removeListener('data', handleKeyPress);
    }

    stdin.on('data', handleKeyPress);
  });
}

/**
 * Categorizes dependencies by update type
 * @param dependencies - Array of outdated dependencies
 * @returns Object with categorized dependencies
 */
function categorizeUpdates(dependencies: DependencyInfo[]): UpdateOptions {
  const patch: UpdateOption[] = [];
  const minor: UpdateOption[] = [];
  const all: UpdateOption[] = [];

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
  }

  return { patch, minor, all };
}
