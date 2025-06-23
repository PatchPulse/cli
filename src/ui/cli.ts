import chalk from 'chalk';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { VERSION } from '../gen/version.gen';
import { createCenteredBox, displayMadeWithLove } from './display';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

export function displayVersion(): void {
  console.log(`${createCenteredBox('Patch Pulse CLI', 40)}

${chalk.cyan.bold('Version:')} ${chalk.white(VERSION)}
${chalk.cyan.bold('Author:')}  ${chalk.underline('<https://github.com/barrymichaeldoyle>')}
${chalk.cyan.bold('Repo:')}    ${chalk.white('https://github.com/PatchPulse/cli')}
${chalk.cyan.bold('License:')} ${chalk.white('MIT')}`);

  displayMadeWithLove();
}

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
