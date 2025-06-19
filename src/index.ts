#!/usr/bin/env node

import chalk from 'chalk';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

// Helper function to create centered bordered boxes
function createCenteredBox(title: string, width: number): string {
  const titleLength = title.length;
  const leftPadding = Math.floor((width - titleLength) / 2);
  const rightPadding = width - titleLength - leftPadding;

  return `${chalk.cyan.bold('╔' + '═'.repeat(width) + '╗')}
${chalk.cyan.bold('║')}${' '.repeat(leftPadding)}${chalk.white.bold(title)}${' '.repeat(rightPadding)}${chalk.cyan.bold('║')}
${chalk.cyan.bold('╚' + '═'.repeat(width) + '╝')}`;
}

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
  updateType?: 'patch' | 'minor' | 'major';
}

interface NpmPackageInfo {
  'dist-tags': {
    latest: string;
  };
  versions: Record<string, any>;
}

async function readPackageJson(path: string): Promise<PackageJson> {
  console.log(`Opening ${path}`);

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
    const response = await fetch(`https://registry.npmjs.org/${packageName}`);

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(
          chalk.yellow(`⚠️  Package "${packageName}" not found on npm registry`)
        );
        return undefined;
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = (await response.json()) as NpmPackageInfo;
    return data['dist-tags'].latest;
  } catch (error) {
    console.warn(
      chalk.yellow(
        `⚠️  Failed to fetch latest version for "${packageName}": ${error}`
      )
    );
    return undefined;
  }
}

function parseVersion(version: string): {
  major: number;
  minor: number;
  patch: number;
} {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!match) {
    return { major: 0, minor: 0, patch: 0 };
  }
  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
  };
}

function getUpdateType(
  current: string,
  latest: string
): 'patch' | 'minor' | 'major' {
  const currentVersion = parseVersion(current);
  const latestVersion = parseVersion(latest);

  if (latestVersion.major > currentVersion.major) return 'major';
  if (latestVersion.minor > currentVersion.minor) return 'minor';
  if (latestVersion.patch > currentVersion.patch) return 'patch';
  return 'patch';
}

function isVersionOutdated(current: string, latest: string): boolean {
  const currentVersion = parseVersion(current);
  const latestVersion = parseVersion(latest);

  return (
    latestVersion.major > currentVersion.major ||
    latestVersion.minor > currentVersion.minor ||
    latestVersion.patch > currentVersion.patch
  );
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

  // Show progress indicator
  const packageNames = Object.keys(dependencies);
  console.log(chalk.gray(`Checking ${packageNames.length} packages...`));

  for (const [name, version] of Object.entries(dependencies)) {
    const latestVersion = await getLatestVersion(name);
    const isOutdated = latestVersion
      ? isVersionOutdated(version, latestVersion)
      : false;
    const updateType =
      latestVersion && isOutdated
        ? getUpdateType(version, latestVersion)
        : undefined;

    dependencyInfos.push({
      name,
      currentVersion: version,
      latestVersion,
      isOutdated,
      updateType,
    });
  }

  // Sort by name for consistent output
  dependencyInfos.sort((a, b) => a.name.localeCompare(b.name));

  // Clear progress message
  process.stdout.write('\r' + ' '.repeat(50) + '\r');

  for (const dep of dependencyInfos) {
    let status: string;
    let versionInfo: string;

    if (!dep.latestVersion) {
      status = chalk.gray('UNKNOWN');
      versionInfo = dep.currentVersion;
    } else if (dep.isOutdated) {
      const updateTypeColor =
        dep.updateType === 'major'
          ? chalk.red
          : dep.updateType === 'minor'
            ? chalk.yellow
            : chalk.green;
      status = updateTypeColor(
        `⚠️  ${dep.updateType?.toUpperCase() || 'OUTDATED'}`
      );
      versionInfo = `${dep.currentVersion} → ${chalk.yellow(dep.latestVersion)}`;
    } else {
      status = chalk.green('✓ UP TO DATE');
      versionInfo = dep.currentVersion;
    }

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
    console.log(
      chalk.cyan.bold(
        'Link to Patch Pulse Slack Bot for notifications on updated packages:'
      ),
      chalk.white.bold(
        'https://slack.com/oauth/v2/authorize?client_id=180374136631.6017466448468&scope=chat:write,commands,incoming-webhook'
      )
    );
    console.log(
      chalk.magenta.bold(
        'Found an issue or have a feature request? Please report it here:'
      ),
      chalk.white.bold('https://github.com/PatchPulse/cli/issues')
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
  const boxWidth = 60;

  console.log(`${createCenteredBox('Patch Pulse CLI', boxWidth)}

${chalk.yellow.bold('A CLI tool for checking npm package dependency versions')}

${chalk.cyan.bold.underline('Usage:')}
  ${chalk.white('patch-pulse')} ${chalk.gray('[options]')}

${chalk.cyan.bold.underline('Options:')}
  ${chalk.white('-h, --help')}     ${chalk.gray('Show this help message')}
  ${chalk.white('-v, --version')}  ${chalk.gray('Show version information')}

${chalk.cyan.bold.underline('Description:')}
  Reads the package.json file in the current directory and displays
  information about your project's dependencies, including version
  status and update availability.

${chalk.cyan.bold.underline('Examples:')}
  ${chalk.white('patch-pulse')}                   ${chalk.gray('# Check dependencies in current directory')}
  ${chalk.white('patch-pulse --help')}            ${chalk.gray('# Show help information')}
  ${chalk.white('patch-pulse --version')}         ${chalk.gray('# Show version information')}

${chalk.cyan.bold.underline('Links:')}
  ${chalk.blue('Docs:')}      ${chalk.white.underline('https://github.com/PatchPulse/cli')}
  ${chalk.blue('Issues:')}    ${chalk.white.underline('https://github.com/PatchPulse/cli/issues')}
  ${chalk.blue('Author:')}    ${chalk.white.underline('https://github.com/barrymichaeldoyle')}
  ${chalk.blue('Slack Bot:')} ${chalk.white.underline('https://slack.com/oauth/v2/authorize?client_id=180374136631.6017466448468&scope=chat:write,commands,incoming-webhook')}

${chalk.gray('─'.repeat(boxWidth))}
${chalk.gray('Made with ❤️  by Barry Michael Doyle')}`);
  process.exit(0);
}

async function checkForCliUpdate(): Promise<void> {
  try {
    const response = await fetch('https://registry.npmjs.org/patch-pulse');
    if (response.ok) {
      const data = (await response.json()) as NpmPackageInfo;
      const latestVersion = data['dist-tags'].latest;
      const currentVersion = '2.0.0';

      if (latestVersion !== currentVersion) {
        console.log(chalk.yellow.bold('\nUpdate Available!'));
        console.log(
          chalk.gray(
            `Current: ${currentVersion} → Latest: ${chalk.yellow(latestVersion)}`
          )
        );
        console.log(
          chalk.cyan.underline('Run: npm install -g patch-pulse@latest')
        );
        console.log();
      }
    }
  } catch (error) {
    // Silently fail - don't show update check errors
  }
}

if (args.includes('--version') || args.includes('-v')) {
  const boxWidth = 40;

  console.log(`${createCenteredBox('Patch Pulse CLI', boxWidth)}

${chalk.white.bold('Version:')} ${chalk.cyan('2.0.0')}
${chalk.white.bold('Author:')}  ${chalk.cyan('Barry Michael Doyle')}
${chalk.white.bold('License:')} ${chalk.cyan('MIT')}

${chalk.gray('Checking for updates...')}`);

  await checkForCliUpdate();

  console.log(chalk.gray('─'.repeat(boxWidth)));
  console.log(
    `${chalk.gray('Made with ❤️  by ')}${chalk.underline('https://github.com/barrymichaeldoyle')}`
  );
  process.exit(0);
}

main().catch(error => {
  console.error(chalk.red(`Fatal error: ${error}`));
  process.exit(1);
});
