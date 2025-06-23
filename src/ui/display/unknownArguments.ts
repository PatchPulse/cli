import chalk from 'chalk';

export function displayUnknownArguments(unknownArgs: string[]): void {
  console.error(
    chalk.red.bold('❌ Unknown command:') +
      ` ${chalk.white(unknownArgs.join(' '))}`
  );
  console.log();
  console.log(chalk.blue.bold(' Available commands:'));
  console.log(
    chalk.white('  npx patch-pulse') +
      chalk.gray('           # Check dependencies')
  );
  console.log(
    chalk.white('  npx patch-pulse --help') + chalk.gray('    # Show help')
  );
  console.log(
    chalk.white('  npx patch-pulse --version') + chalk.gray(' # Show version')
  );
  console.log(
    chalk.white('  npx patch-pulse --license') + chalk.gray(' # Show license')
  );
  console.log();
  console.log(chalk.blue.bold(' Configuration options:'));
  console.log(
    chalk.white('  npx patch-pulse -s <packages>') +
      chalk.gray('     # Skip packages (supports exact names and patterns)')
  );
  console.log();
  console.log(
    chalk.cyan.bold('For more information:') +
      ` ${chalk.white.bold('npx patch-pulse --help')}`
  );
}
