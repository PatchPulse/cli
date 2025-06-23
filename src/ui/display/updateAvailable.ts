import chalk from 'chalk';

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
