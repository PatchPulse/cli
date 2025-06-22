import chalk from 'chalk';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { VERSION } from '../gen/version.gen';
import { DependencyInfo } from '../types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Creates a centered bordered box with a title
 * @param title - The title to display in the box
 * @param width - The width of the box
 * @returns The centered bordered box with the title
 */
export function createCenteredBox(title: string, width: number): string {
  const titleLength = title.length;
  const leftPadding = Math.floor((width - titleLength) / 2);
  const rightPadding = width - titleLength - leftPadding;

  return `${chalk.cyan.bold('╔' + '═'.repeat(width) + '╗')}
${chalk.cyan.bold('║')}${' '.repeat(leftPadding)}${chalk.white.bold(title)}${' '.repeat(rightPadding)}${chalk.cyan.bold('║')}
${chalk.cyan.bold('╚' + '═'.repeat(width) + '╝')}`;
}

/**
 * Displays the "Made with love" message
 */
export function displayMadeWithLove(): void {
  console.log(chalk.gray('─'.repeat(40)));
  console.log(
    `${chalk.gray('Made with ❤️  by ')}${chalk.underline('Barry Michael Doyle')}`
  );
}

/**
 * Displays the help message
 */
export function displayHelp(): void {
  const boxWidth = 40;

  console.log(`${createCenteredBox('Patch Pulse CLI', boxWidth)}

${chalk.white.bold('🔍 A CLI tool for checking npm package dependency versions')}

${chalk.cyan.bold.underline('📖 Usage:')}
  ${chalk.white('npx patch-pulse')} ${chalk.gray('[options]')}

${chalk.cyan.bold.underline('⚙️  Options:')}
  ${chalk.white('-i, -h, --info, --help')}   ${chalk.gray('Show current message')}
  ${chalk.white('-v, --version')}            ${chalk.gray('Show version information')}
  ${chalk.white('-l, --license')}            ${chalk.gray('Show license information')}

${chalk.cyan.bold.underline('📝 Description:')}
  Reads the \`package.json\` file in the current directory and displays
  information about your project's dependencies, including version
  status and update availability.

${chalk.cyan.bold.underline('💡 Examples:')}
  ${chalk.white('npx patch-pulse')}          ${chalk.gray('# Check dependencies in current directory')}
  ${chalk.white('npx patch-pulse -v')}       ${chalk.gray('# Show version information')}
  ${chalk.white('npx patch-pulse -l')}       ${chalk.gray('# Show license information')}

${chalk.cyan.bold.underline('🔗 Links:')}
  ${chalk.blue('📚 Docs:')}      ${chalk.white.underline('https://github.com/PatchPulse/cli')}
  ${chalk.blue('🐛 Issues:')}    ${chalk.white.underline('https://github.com/PatchPulse/cli/issues')}
  ${chalk.blue('👨‍ Author:')}    ${chalk.white.underline('https://github.com/barrymichaeldoyle')}
  ${chalk.blue('🤖 Slack Bot:')} ${chalk.white.underline('https://slack.com/oauth/v2/authorize?client_id=180374136631.6017466448468&scope=chat:write,commands,incoming-webhook')}`);

  displayMadeWithLove();
}

/**
 * Displays the version information
 */
export function displayVersion(): void {
  console.log(`${createCenteredBox('Patch Pulse CLI', 40)}

${chalk.cyan.bold('Version:')} ${chalk.white(VERSION)}
${chalk.cyan.bold('Author:')}  ${chalk.underline('<https://github.com/barrymichaeldoyle>')}
${chalk.cyan.bold('Repo:')}    ${chalk.white('https://github.com/PatchPulse/cli')}
${chalk.cyan.bold('License:')} ${chalk.white('MIT')}`);

  displayMadeWithLove();
}

/**
 * Displays the license information
 */
export function displayLicense(): void {
  try {
    const licenseContent = readFileSync(
      join(__dirname, '..', '..', 'LICENSE'),
      'utf-8'
    );
    console.log(`${createCenteredBox('License', 60)}

${chalk.white(licenseContent)}`);
  } catch (error) {
    console.error(chalk.red('Error reading LICENSE file:'), error);
    console.log(chalk.yellow('License: MIT'));
    process.exit(1);
  }
}

/**
 * Displays a message when an update is available
 * @param currentVersion - The current version of the package
 * @param latestVersion - The latest version of the package
 */
export function displayUpdateAvailable(
  currentVersion: string,
  latestVersion: string
): void {
  console.log(chalk.gray('\n' + '═'.repeat(50)));
  console.log(chalk.yellow.bold('🚀 UPDATE AVAILABLE!'));
  console.log(chalk.gray('═'.repeat(50)));

  console.log(
    chalk.white.bold('Current Version:') + ` ${chalk.gray(currentVersion)}`
  );
  console.log(
    chalk.white.bold('Latest Version:') + ` ${chalk.yellow.bold(latestVersion)}`
  );

  console.log(chalk.gray('\nTo update, run:'));
  console.log(chalk.cyan.bold('  npx patch-pulse@latest'));

  console.log(chalk.gray('═'.repeat(50)));
}

export function displayThankYouMessage(): void {
  console.log();
  console.log(
    chalk.magentaBright.bold('🎉 Thank you for using Patch Pulse CLI!')
  );
  console.log(
    chalk.cyan.bold('💡 For more info:') +
      ` ${chalk.white.bold('npx patch-pulse --help')}`
  );
}

export function displaySummary(allDependencies: DependencyInfo[]): void {
  const total = allDependencies.length;
  const upToDate = allDependencies.filter(d => !d.isOutdated).length;
  const outdated = allDependencies.filter(d => d.isOutdated).length;
  const unknown = allDependencies.filter(d => !d.latestVersion).length;

  // Count by update type
  const majorUpdates = allDependencies.filter(
    d => d.updateType === 'major'
  ).length;
  const minorUpdates = allDependencies.filter(
    d => d.updateType === 'minor'
  ).length;
  const patchUpdates = allDependencies.filter(
    d => d.updateType === 'patch'
  ).length;

  console.log(chalk.gray('═'.repeat(60)));
  console.log(chalk.cyan.bold(`📊 Summary (${total} packages)`));
  console.log(chalk.gray('═'.repeat(60)));

  console.log(`  ${chalk.green('✓  Up to date:')} ${upToDate}`);

  // Only show breakdown if there are outdated packages
  if (outdated > 0) {
    const breakdown = [];
    if (majorUpdates > 0) {
      breakdown.push(`${majorUpdates} major`);
    }
    if (minorUpdates > 0) {
      breakdown.push(`${minorUpdates} minor`);
    }
    if (patchUpdates > 0) {
      breakdown.push(`${patchUpdates} patch`);
    }

    const breakdownText =
      breakdown.length > 0 ? ` ${chalk.gray(`(${breakdown.join(', ')})`)}` : '';
    console.log(`  ${chalk.blue('⚠  Outdated:')} ${outdated}${breakdownText}`);
  } else {
    console.log(`  ${chalk.blue('⚠  Outdated:')} ${outdated}`);
  }

  console.log(`  ${chalk.magenta('?  Unknown:')} ${unknown}`);

  console.log(chalk.gray('═'.repeat(60)));
}

export * from './cli';
export * from './display';
export * from './summary';
