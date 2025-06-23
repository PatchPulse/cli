import chalk from 'chalk';

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
