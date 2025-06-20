import chalk from 'chalk';
import { VERSION } from '../gen/version.gen';
import { DependencyInfo } from '../types';

// Helper function to create centered bordered boxes
export function createCenteredBox(title: string, width: number): string {
  const titleLength = title.length;
  const leftPadding = Math.floor((width - titleLength) / 2);
  const rightPadding = width - titleLength - leftPadding;

  return `${chalk.cyan.bold('╔' + '═'.repeat(width) + '╗')}
${chalk.cyan.bold('║')}${' '.repeat(leftPadding)}${chalk.white.bold(title)}${' '.repeat(rightPadding)}${chalk.cyan.bold('║')}
${chalk.cyan.bold('╚' + '═'.repeat(width) + '╝')}`;
}

export function displayHelp(): void {
  const boxWidth = 40;

  console.log(`${createCenteredBox('Patch Pulse CLI', boxWidth)}

${chalk.yellow.bold('🔍 A CLI tool for checking npm package dependency versions')}

${chalk.cyan.bold.underline('📖 Usage:')}
  ${chalk.white('patch-pulse')} ${chalk.gray('[options]')}

${chalk.cyan.bold.underline('⚙️  Options:')}
  ${chalk.white('-i, -h, --info, --help')}   ${chalk.gray('Show this info message')}
  ${chalk.white('-v, --version')}            ${chalk.gray('Show version information')}

${chalk.cyan.bold.underline('📝 Description:')}
  Reads the package.json file in the current directory and displays
  information about your project's dependencies, including version
  status and update availability.

${chalk.cyan.bold.underline('💡 Examples:')}
  ${chalk.white('patch-pulse')}          ${chalk.gray('# Check dependencies in current directory')}
  ${chalk.white('patch-pulse --info')}   ${chalk.gray('# Show this info message')}
  ${chalk.white('patch-pulse -v')}       ${chalk.gray('# Show version information')}

${chalk.cyan.bold.underline('🔗 Links:')}
  ${chalk.blue('📚 Docs:')}      ${chalk.white.underline('https://github.com/PatchPulse/cli')}
  ${chalk.blue('🐛 Issues:')}    ${chalk.white.underline('https://github.com/PatchPulse/cli/issues')}
  ${chalk.blue('👨‍ Author:')}    ${chalk.white.underline('https://github.com/barrymichaeldoyle')}
  ${chalk.blue('🤖 Slack Bot:')} ${chalk.white.underline('https://slack.com/oauth/v2/authorize?client_id=180374136631.6017466448468&scope=chat:write,commands,incoming-webhook')}`);

  console.log();
  console.log(chalk.gray('─'.repeat(40)));
  console.log(
    `${chalk.gray('Made with ❤️  by ')}${chalk.underline('Barry Michael Doyle')}`
  );
}

export function displayVersion(): void {
  console.log(`${createCenteredBox('Patch Pulse CLI', 40)}

${chalk.white.bold('Version:')} ${chalk.cyan(VERSION)}
${chalk.white.bold('Author:')}  ${chalk.cyan('Barry Michael Doyle ')}${chalk.underline('<https://github.com/barrymichaeldoyle>')}
${chalk.white.bold('License:')} ${chalk.cyan('MIT')}`);
}

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
  console.log(chalk.cyan.bold('  npm install -g patch-pulse@latest'));

  console.log(chalk.gray('═'.repeat(50)));
}

export function displayThankYouMessage(): void {
  console.log();
  console.log(chalk.yellow.bold('🎉 Thank you for using Patch Pulse CLI!'));
  console.log(
    chalk.cyan.bold('💡 For more info:') +
      ` ${chalk.white.bold('patch-pulse --help')}`
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
    if (majorUpdates > 0) breakdown.push(`${majorUpdates} major`);
    if (minorUpdates > 0) breakdown.push(`${minorUpdates} minor`);
    if (patchUpdates > 0) breakdown.push(`${patchUpdates} patch`);

    const breakdownText =
      breakdown.length > 0 ? ` ${chalk.gray(`(${breakdown.join(', ')})`)}` : '';
    console.log(
      `  ${chalk.yellow('⚠  Outdated:')} ${outdated}${breakdownText}`
    );
  } else {
    console.log(`  ${chalk.yellow('⚠  Outdated:')} ${outdated}`);
  }

  console.log(`  ${chalk.magenta('?  Unknown:')} ${unknown}`);

  console.log(chalk.gray('═'.repeat(60)));
}
