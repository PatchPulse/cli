import chalk from 'chalk';

/**
 * Displays the thank you message
 */
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
