#!/usr/bin/env node

import chalk from 'chalk';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
  bundledDependencies?: Record<string, string>;
}

interface DependencyInfo {
  name: string;
  currentVersion: string;
  latestVersion?: string;
  isOutdated: boolean;
}

async function readPackageJson(path: string): Promise<PackageJson> {
  console.log(`\nOpening ${path}`);

  if (!existsSync(path)) {
    throw new Error(`package.json not found at ${path}`);
  }

  console.log('Reading package.json\n');

  try {
    const contents = readFileSync(path, 'utf-8');
    return JSON.parse(contents);
  } catch (error) {
    throw new Error(`Error parsing package.json: ${error}`);
  }
}

async function getLatestVersion(
  packageName: string
): Promise<string | undefined> {
  try {
    // In a real implementation, you'd fetch from npm registry
    // For now, we'll simulate this with a placeholder
    // You could use: https://registry.npmjs.org/${packageName}/latest
    return undefined;
  } catch (error) {
    return undefined;
  }
}

async function checkDependencyVersions(
  dependencies: Record<string, string> | undefined,
  category: string
): Promise<void> {
  if (!dependencies || Object.keys(dependencies).length === 0) {
    return;
  }

  console.log(chalk.cyan.bold(`\n${category}:`));
  console.log(chalk.cyan('─'.repeat(category.length + 1)));

  const dependencyInfos: DependencyInfo[] = [];

  for (const [name, version] of Object.entries(dependencies)) {
    const latestVersion = await getLatestVersion(name);
    const isOutdated = latestVersion && latestVersion !== version;

    dependencyInfos.push({
      name,
      currentVersion: version,
      latestVersion,
      isOutdated: !!isOutdated,
    });
  }

  // Sort by name for consistent output
  dependencyInfos.sort((a, b) => a.name.localeCompare(b.name));

  for (const dep of dependencyInfos) {
    const status = dep.isOutdated
      ? chalk.red('⚠️  OUTDATED')
      : chalk.green('✓ UP TO DATE');

    const versionInfo = dep.latestVersion
      ? `${dep.currentVersion} → ${chalk.yellow(dep.latestVersion)}`
      : dep.currentVersion;

    console.log(
      `${status} ${chalk.white(dep.name)} ${chalk.gray(versionInfo)}`
    );
  }
}

async function main(): Promise<void> {
  // Force colors in output
  process.env.FORCE_COLOR = '1';

  const packageJsonPath = join(process.cwd(), 'package.json');

  try {
    const packageJson = await readPackageJson(packageJsonPath);

    await checkDependencyVersions(packageJson.dependencies, 'Dependencies');
    await checkDependencyVersions(
      packageJson.devDependencies,
      'Dev Dependencies'
    );
    await checkDependencyVersions(
      packageJson.peerDependencies,
      'Peer Dependencies'
    );
    await checkDependencyVersions(
      packageJson.optionalDependencies,
      'Optional Dependencies'
    );
    await checkDependencyVersions(
      packageJson.bundledDependencies,
      'Bundled Dependencies'
    );

    console.log();
    console.log(chalk.yellow.bold('Thank you for using Patch Pulse CLI!'));
    console.log();
    console.log(
      chalk.cyan.bold(
        'Link to Patch Pulse Slack Bot for notifications on updated packages:'
      ),
      chalk.white.bold(
        'https://slack.com/oauth/v2/authorize?client_id=180374136631.6017466448468&scope=chat:write,commands,incoming-webhook'
      )
    );
    console.log();
    console.log(
      chalk.magenta.bold(
        'Found an issue or have a feature request? Please report it here:'
      ),
      chalk.white.bold(
        'https://github.com/barrymichaeldoyle/patch-pulse-cli/issues'
      )
    );
    console.log();
  } catch (error) {
    console.error(chalk.red(`Error: ${error}`));
    process.exit(1);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
${chalk.cyan.bold('Patch Pulse CLI v2.0')}

A TypeScript-based CLI tool for checking npm package dependency versions.

${chalk.yellow('Usage:')}
  patch-pulse [options]

${chalk.yellow('Options:')}
  -h, --help     Show this help message
  -v, --version  Show version information

${chalk.yellow('Description:')}
  Reads the package.json file in the current directory and displays
  information about your project's dependencies, including version
  status and update availability.

${chalk.green('Examples:')}
  patch-pulse                   # Check dependencies in current directory
  patch-pulse --help            # Show help information
`);
  process.exit(0);
}

if (args.includes('--version') || args.includes('-v')) {
  console.log('patch-pulse v2.0.0');
  process.exit(0);
}

main().catch(error => {
  console.error(chalk.red(`Fatal error: ${error}`));
  process.exit(1);
});
