import chalk from 'chalk';

import { createCenteredBox } from '../createCenteredBox';
import { displayMadeWithLove } from './madeWithLove';

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

${chalk.cyan.bold.underline('🔧 Configuration Options:')}
  ${chalk.white('-s, --skip <packages>')}    ${chalk.gray('Skip packages (supports exact names and patterns)')}

${chalk.cyan.bold.underline('📁 Configuration File:')}
  Create a \`patchpulse.config.json\` file in your project root:
  ${chalk.gray('{')}
    ${chalk.gray('"skip": ["lodash", "@types/*", "test-*"]')}
  ${chalk.gray('}')}

${chalk.cyan.bold.underline('📝 Description:')}
  Reads the \`package.json\` file in the current directory and displays
  information about your project's dependencies, including version
  status and update availability.

${chalk.cyan.bold.underline('💡 Examples:')}
  ${chalk.white('npx patch-pulse')}                          ${chalk.gray('# Check dependencies in current directory')}
  ${chalk.white('npx patch-pulse --version')}                ${chalk.gray('# Show version information')}
  ${chalk.white('npx patch-pulse --license')}                ${chalk.gray('# Show license information')}
  ${chalk.white('npx patch-pulse --skip "lodash,@types/*"')} ${chalk.gray('# Skip specific packages and patterns')}

${chalk.cyan.bold.underline('🔗 Links:')}
  ${chalk.blue('📚 Docs:')}      ${chalk.white.underline('https://github.com/PatchPulse/cli')}
  ${chalk.blue('🐛 Issues:')}    ${chalk.white.underline('https://github.com/PatchPulse/cli/issues')}
  ${chalk.blue('👨‍ Author:')}    ${chalk.white.underline('https://github.com/barrymichaeldoyle')}
  ${chalk.blue('🤖 Slack Bot:')} ${chalk.white.underline('https://slack.com/oauth/v2/authorize?client_id=180374136631.6017466448468&scope=chat:write,commands,incoming-webhook')}`);

  displayMadeWithLove();
}
