import chalk from 'chalk';

/**
 * Displays the "Made with love" message
 */
export function displayMadeWithLove(): void {
  console.log(chalk.gray('─'.repeat(40)));
  console.log(
    `${chalk.gray('Made with ❤️  by ')}${chalk.underline('Barry Michael Doyle')}`
  );
}
