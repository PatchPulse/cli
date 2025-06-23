import chalk from 'chalk';

import { VERSION } from '../../gen/version.gen';
import { createCenteredBox } from '../createCenteredBox';
import { displayMadeWithLove } from './madeWithLove';

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
