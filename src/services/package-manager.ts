import chalk from 'chalk';
import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';
import { type PackageManager, type UpdateableDependency } from '../types';
import { pluralize } from '../utils/pluralize';

export interface PackageManagerInfo {
  name: PackageManager;
  lockFiles: string[];
  addCommand: string;
}

const PACKAGE_MANAGERS: Record<PackageManager, PackageManagerInfo> = {
  npm: {
    name: 'npm',
    lockFiles: ['package-lock.json'],
    addCommand: 'npm install',
  },
  pnpm: {
    name: 'pnpm',
    lockFiles: ['pnpm-lock.yaml'],
    addCommand: 'pnpm add',
  },
  bun: {
    name: 'bun',
    lockFiles: ['bun.lock', 'bun.lockb'],
    addCommand: 'bun add',
  },
  yarn: {
    name: 'yarn',
    lockFiles: ['yarn.lock'],
    addCommand: 'yarn add',
  },
};

/**
 * Detects the package manager being used in the current directory
 * @param cwd - The current working directory
 * @returns The detected package manager info or npm as default
 */
export function detectPackageManager(
  cwd: string = process.cwd()
): PackageManagerInfo {
  for (const [, info] of Object.entries(PACKAGE_MANAGERS)) {
    // Check if any of the lock files exist
    const hasLockFile = info.lockFiles.some(lockFile => {
      const lockFilePath = join(cwd, lockFile);
      return existsSync(lockFilePath);
    });

    if (hasLockFile) {
      return info;
    }
  }

  // Default to npm if no lock file is found
  return PACKAGE_MANAGERS.npm;
}

/**
 * Gets package manager info by name
 * @param name - The package manager name
 * @returns The package manager info
 */
export function getPackageManagerInfo(
  name: PackageManager
): PackageManagerInfo {
  return PACKAGE_MANAGERS[name];
}

/**
 * Runs a package manager command
 * @param command - The command to run
 * @param args - The arguments for the command
 * @returns Promise that resolves when the command completes
 */
export function runPackageManagerCommand(
  command: string,
  args: string[]
): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
    });

    child.on('close', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', error => {
      reject(error);
    });
  });
}

/**
 * Updates dependencies based on update type
 * @param dependencies - Array of dependencies to update
 * @param packageManager - The package manager to use
 * @returns Promise that resolves when all updates are complete
 */
export async function updateDependencies({
  dependencies,
  packageManager,
}: {
  dependencies: UpdateableDependency[];
  packageManager: PackageManagerInfo;
}): Promise<void> {
  if (dependencies.length === 0) {
    console.log(chalk.yellow('No dependencies to update'));
    return;
  }

  const dependencyWord = pluralize({
    count: dependencies.length,
    singular: 'dependency',
    plural: 'dependencies',
  });

  console.log(
    chalk.cyan(
      `\n🔄 Updating ${dependencies.length} ${dependencyWord} using ${packageManager.name}...`
    )
  );

  // Group dependencies by category
  const groupedDeps = dependencies.reduce(
    (groups, dep) => {
      const category = dep.category || 'Dependencies';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(dep);
      return groups;
    },
    {} as Record<string, typeof dependencies>
  );

  // Show version changes for each dependency grouped by category
  for (const [category, deps] of Object.entries(groupedDeps)) {
    if (deps.length > 0) {
      console.log(chalk.gray(`${category}:`));

      for (const dep of deps) {
        const updateTypeColor = {
          major: chalk.yellow,
          minor: chalk.magenta,
          patch: chalk.blue,
        }[dep.updateType];
        const updateTypeLabel = updateTypeColor(`[${dep.updateType}]`);
        console.log(
          chalk.gray(
            `   ${dep.packageName}: ${dep.currentVersion} → ${dep.latestVersion} ${updateTypeLabel}`
          )
        );
      }
    }
  }

  try {
    // Build the arguments array for the package manager
    const args: string[] = [];

    // Add the appropriate subcommand based on package manager
    if (packageManager.name === 'npm') {
      args.push('install');
      args.push('--save-exact');
    } else if (packageManager.name === 'pnpm') {
      args.push('add');
    } else if (packageManager.name === 'yarn') {
      args.push('add');
    } else if (packageManager.name === 'bun') {
      args.push('add');
    }

    // Add all the package@version strings
    for (const dep of dependencies) {
      args.push(`${dep.packageName}@${dep.latestVersion}`);
    }

    // Run the command
    await runPackageManagerCommand(packageManager.name, args);

    console.log(
      chalk.green(
        `\n✅ Successfully updated ${dependencies.length} ${dependencyWord}!`
      )
    );
  } catch (error) {
    console.error(chalk.red(`Failed to update dependencies: ${error}`));
    throw error;
  }
}
