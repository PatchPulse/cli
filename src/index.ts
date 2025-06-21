#!/usr/bin/env node

import chalk from 'chalk';
import { join } from 'path';
import { checkDependencyVersions } from './core/dependency-checker';
import { checkForCliUpdate } from './services/npm';
import { readPackageJson } from './services/package';
import { DependencyInfo } from './types';
import {
  displayHelp,
  displayLicense,
  displaySummary,
  displayThankYouMessage,
  displayVersion,
} from './utils/ui';

async function main(): Promise<void> {
  // Force colors in output
  process.env.FORCE_COLOR = '1';

  const packageJsonPath = join(process.cwd(), 'package.json');

  try {
    const packageJson = await readPackageJson(packageJsonPath);
    const allDependencies: DependencyInfo[] = [];

    // Define dependency types to check with their labels
    const dependencyTypeLabels: Record<string, string> = {
      dependencies: 'Dependencies',
      devDependencies: 'Dev Dependencies',
      peerDependencies: 'Peer Dependencies',
      optionalDependencies: 'Optional Dependencies',
    };

    // Check each dependency type in the order they appear in package.json
    for (const [key, value] of Object.entries(packageJson)) {
      if (dependencyTypeLabels[key] && value && typeof value === 'object') {
        try {
          const dependencies = await checkDependencyVersions(
            value as Record<string, string>,
            dependencyTypeLabels[key]
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
      displayThankYouMessage();
    } else {
      console.log(chalk.yellow('⚠️  No dependencies found to check'));
    }

    // Don't let CLI update errors stop the main flow
    try {
      await checkForCliUpdate();
    } catch (error) {
      // Silently fail for CLI updates
    }
  } catch (error) {
    console.error(chalk.red(`Error: ${error}`));
    process.exit(1);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);

// Check for unknown commands first
const validFlags = [
  '--help',
  '-h',
  '--info',
  '-i',
  '--version',
  '-v',
  '--license',
];
const unknownArgs = args.filter(arg => !validFlags.includes(arg));

if (unknownArgs.length > 0) {
  console.error(
    chalk.red.bold('❌ Unknown command:') +
      ` ${chalk.white(unknownArgs.join(' '))}`
  );
  console.log();
  console.log(chalk.blue.bold(' Available commands:'));
  console.log(
    chalk.white('  npx patch-pulse') +
      chalk.gray('           # Check dependencies')
  );
  console.log(
    chalk.white('  npx patch-pulse --help') + chalk.gray('    # Show help')
  );
  console.log(
    chalk.white('  npx patch-pulse --version') + chalk.gray(' # Show version')
  );
  console.log(
    chalk.white('  npx patch-pulse --license') + chalk.gray(' # Show license')
  );
  console.log();
  console.log(
    chalk.cyan.bold('For more information:') +
      ` ${chalk.white.bold('npx patch-pulse --help')}`
  );
  process.exit(1);
}

if (
  args.includes('--help') ||
  args.includes('-h') ||
  args.includes('--info') ||
  args.includes('-i')
) {
  displayHelp();
  process.exit(0);
}

if (args.includes('--version') || args.includes('-v')) {
  displayVersion();
  process.exit(0);
}

if (args.includes('--license') || args.includes('-l')) {
  displayLicense();
  process.exit(0);
}

main().catch(error => {
  console.error(chalk.red(`Fatal error: ${error}`));
  process.exit(1);
});
