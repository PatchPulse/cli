import chalk from 'chalk';

import { getLatestVersion } from '../services/npm';
import { DependencyInfo } from '../types';
import { ProgressSpinner } from '../utils/progress';
import { getUpdateType, isVersionOutdated } from '../utils/version';

export async function checkDependencyVersions(
  dependencies: Record<string, string> | undefined,
  category: string
): Promise<DependencyInfo[]> {
  if (!dependencies || Object.keys(dependencies).length === 0) {
    return [];
  }

  console.log(chalk.cyan.bold(`${category}:`));
  console.log(chalk.cyan('─'.repeat(category.length + 1)));

  const packageNames = Object.keys(dependencies);
  const progress = new ProgressSpinner();
  progress.start(`Checking ${packageNames.length} packages...`);

  const concurrencyLimit = 10;
  const dependencyInfos: DependencyInfo[] = [];
  let completedCount = 0;

  for (let i = 0; i < packageNames.length; i += concurrencyLimit) {
    const batch = packageNames.slice(i, i + concurrencyLimit);
    const batchPromises = batch.map(async name => {
      const version = dependencies[name];
      const latestVersion = await getLatestVersion(name);
      const isOutdated = latestVersion
        ? isVersionOutdated(version, latestVersion)
        : false;
      const updateType =
        latestVersion && isOutdated
          ? getUpdateType(version, latestVersion)
          : undefined;

      // Update progress for each completed package
      completedCount++;
      progress.updateMessage(
        `Checking ${packageNames.length} packages... (${completedCount}/${packageNames.length})`
      );

      return {
        name,
        currentVersion: version,
        latestVersion,
        isOutdated,
        updateType,
      };
    });

    const batchResults = await Promise.all(batchPromises);
    dependencyInfos.push(...batchResults);
  }

  progress.stop();
  displayResults(dependencyInfos);
  console.log();

  return dependencyInfos;
}

function displayResults(dependencyInfos: DependencyInfo[]): void {
  for (const dep of dependencyInfos) {
    let status: string;
    let versionInfo: string;

    if (!dep.latestVersion) {
      status = chalk.red('NOT FOUND');
      versionInfo = `${dep.currentVersion} (not found on npm registry)`;
    } else if (dep.isOutdated) {
      const updateTypeColor = {
        major: chalk.yellow,
        minor: chalk.magenta,
        patch: chalk.blue,
      }[dep.updateType || 'patch'];
      status = updateTypeColor(`${dep.updateType?.toUpperCase() || 'UPDATE'}`);
      versionInfo = `${dep.currentVersion} → ${chalk.cyan(dep.latestVersion)}`;
    } else {
      status = chalk.green('UP TO DATE');
      versionInfo = dep.currentVersion;
    }

    console.log(
      `${status} ${chalk.white(dep.name)} ${chalk.gray(versionInfo)}`
    );
  }
}
