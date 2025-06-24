#!/usr/bin/env node

import chalk from 'chalk';
import { join } from 'path';
import { checkDependencyVersions } from './core/dependency-checker';
import { getConfig } from './services/config';
import { checkForCliUpdate } from './services/npm';
import { readPackageJson } from './services/package';
import {
  detectPackageManager,
  getPackageManagerInfo,
  updateDependencies,
} from './services/package-manager';
import { type DependencyInfo } from './types';
import { displayHelp } from './ui/display/help';
import { displayLicense } from './ui/display/license';
import { displaySummary } from './ui/display/summary';
import { displayThankYouMessage } from './ui/display/thankYouMessage';
import { displayUnknownArguments } from './ui/display/unknownArguments';
import { displayUpdatePrompt } from './ui/display/updatePrompt';
import { displayVersion } from './ui/display/version';
import { getUnknownArgs } from './utils/getUnknownArgs';
import { hasAnyFlag } from './utils/hasAnyFlag';

async function main(): Promise<void> {
  /**
   * Force colors in output
   */
  process.env.FORCE_COLOR = '1';

  const packageJsonPath = join(process.cwd(), 'package.json');

  try {
    const packageJson = await readPackageJson(packageJsonPath);
    const allDependencies: DependencyInfo[] = [];

    const config = getConfig();

    const dependencyTypeLabels: Record<string, string> = {
      dependencies: 'Dependencies',
      devDependencies: 'Dev Dependencies',
      peerDependencies: 'Peer Dependencies',
      optionalDependencies: 'Optional Dependencies',
    };

    for (const [key, value] of Object.entries(packageJson)) {
      if (dependencyTypeLabels[key] && value && typeof value === 'object') {
        try {
          const dependencies = await checkDependencyVersions(
            value as Record<string, string>,
            dependencyTypeLabels[key],
            config
          );
          allDependencies.push(...dependencies);
        } catch (error) {
          console.error(
            chalk.red(`Error checking ${key.toLowerCase()}: ${error}`)
          );
        }
      }
    }

    if (allDependencies.length > 0) {
      displaySummary(allDependencies);

      // Check if we should show the update prompt
      if (!config.noUpdatePrompt) {
        // Detect package manager
        const packageManager = config.packageManager
          ? getPackageManagerInfo(config.packageManager)
          : detectPackageManager();

        // Show update prompt
        const updateType = await displayUpdatePrompt(
          allDependencies,
          packageManager
        );

        if (updateType) {
          const outdatedDeps = allDependencies.filter(
            d => d.isOutdated && !d.isSkipped
          );

          let depsToUpdate: Array<{
            packageName: string;
            latestVersion: string;
          }> = [];

          if (updateType === 'patch') {
            depsToUpdate = outdatedDeps
              .filter(d => d.updateType === 'patch' && d.latestVersion)
              .map(d => ({
                packageName: d.packageName,
                latestVersion: d.latestVersion!,
              }));
          } else if (updateType === 'minor') {
            depsToUpdate = outdatedDeps
              .filter(
                d =>
                  (d.updateType === 'minor' || d.updateType === 'patch') &&
                  d.latestVersion
              )
              .map(d => ({
                packageName: d.packageName,
                latestVersion: d.latestVersion!,
              }));
          } else if (updateType === 'all') {
            depsToUpdate = outdatedDeps
              .filter(d => d.latestVersion)
              .map(d => ({
                packageName: d.packageName,
                latestVersion: d.latestVersion!,
              }));
          }

          if (depsToUpdate.length > 0) {
            await updateDependencies(depsToUpdate, packageManager);
          }
        }
      }

      displayThankYouMessage();
    } else {
      console.log(chalk.yellow('⚠️  No dependencies found to check'));
    }

    try {
      await checkForCliUpdate();
    } catch {
      // Silently fail for CLI updates, i.e. don't let CLI update errors stop the main flow
    }

    // Ensure the process exits properly
    process.exit(0);
  } catch (error) {
    console.error(chalk.red(`Error: ${error}`));
    process.exit(1);
  }
}

const args = process.argv.slice(2);

const validFlags = [
  '-h',
  '--help',
  '-i',
  '--info',
  '-v',
  '--version',
  '-l',
  '--license',
  '-s',
  '--skip',
  '--package-manager',
  '--update-prompt',
  '--no-update-prompt',
];
const unknownArgs = getUnknownArgs(args, validFlags);
if (unknownArgs.length > 0) {
  displayUnknownArguments(unknownArgs);
  process.exit(1);
}

if (hasAnyFlag(args, ['--help', '-h', '--info', '-i'])) {
  displayHelp();
  process.exit(0);
}

if (hasAnyFlag(args, ['--version', '-v'])) {
  displayVersion();
  process.exit(0);
}

if (hasAnyFlag(args, ['--license', '-l'])) {
  displayLicense();
  process.exit(0);
}

main().catch(error => {
  console.error(chalk.red(`Fatal error: ${error}`));
  process.exit(1);
});
