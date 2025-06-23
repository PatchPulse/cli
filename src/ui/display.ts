import chalk from 'chalk';

export function createCenteredBox(title: string, width: number): string {
  const titleLength = title.length;
  const leftPadding = Math.floor((width - titleLength) / 2);
  const rightPadding = width - titleLength - leftPadding;

  return `${chalk.cyan.bold('╔' + '═'.repeat(width) + '╗')}
${chalk.cyan.bold('║')}${' '.repeat(leftPadding)}${chalk.white.bold(title)}${' '.repeat(rightPadding)}${chalk.cyan.bold('║')}
${chalk.cyan.bold('╚' + '═'.repeat(width) + '╝')}`;
}

export function displayMadeWithLove(): void {
  console.log(chalk.gray('─'.repeat(40)));
  console.log(
    `${chalk.gray('Made with ❤️  by ')}${chalk.underline('Barry Michael Doyle')}`
  );
}
