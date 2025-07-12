import chalk from 'chalk';

import { PatchPulseConfig, shouldSkipPackage } from '../services/config';
import { getLatestVersion } from '../services/npm';
import { UpdateType, type DependencyInfo } from '../types';
import { ProgressSpinner } from '../ui/progress';
import { getUpdateType } from '../utils/getUpdateType';
import { isVersionOutdated } from '../utils/isVersionOutdated';

export async function checkDependencyVersions(
  dependencies: Record<string, string> | undefined,
  category: string,
  config?: PatchPulseConfig
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
    const batchPromises = batch.map(async packageName => {
      const version = dependencies[packageName];

      const isSkipped = shouldSkipPackage({ packageName, config });

      let latestVersion: string | undefined;
      let isOutdated = false;
      let updateType: UpdateType | undefined;

      if (!isSkipped) {
        latestVersion = await getLatestVersion(packageName);

        if (latestVersion) {
          // Check if the version is outdated (works for both standard semver and version ranges)
          isOutdated = isVersionOutdated({
            current: version,
            latest: latestVersion,
          });
          updateType = isOutdated
            ? getUpdateType({ current: version, latest: latestVersion })
            : undefined;
        }
      }

      // Update progress for each completed package
      completedCount++;
      progress.updateMessage(
        `Checking ${packageNames.length} packages... (${completedCount}/${packageNames.length})`
      );

      return {
        packageName,
        currentVersion: version,
        latestVersion,
        isOutdated,
        updateType,
        isSkipped,
        category,
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

    if (dep.isSkipped) {
      status = chalk.gray('SKIPPED');
      versionInfo = dep.currentVersion;
    } else if (!dep.latestVersion) {
      status = chalk.red('NOT FOUND');
      versionInfo = `${dep.currentVersion} (not found on npm registry)`;
    } else if (['latest', '*'].includes(dep.currentVersion)) {
      status = chalk.cyan('LATEST TAG');
      versionInfo = `${dep.currentVersion} → ${chalk.cyan(dep.latestVersion)} (actual latest version)`;
    } else if (!/^\d+\.\d+\.\d+/.test(dep.currentVersion)) {
      // Handle version ranges
      if (dep.isOutdated) {
        const updateTypeColor = {
          major: chalk.yellow,
          minor: chalk.magenta,
          patch: chalk.blue,
        }[dep.updateType || 'patch'];
        status = updateTypeColor(
          `${dep.updateType?.toUpperCase() || 'UPDATE'}`
        );
        versionInfo = `${dep.currentVersion} → ${chalk.cyan(dep.latestVersion)}`;
      } else {
        status = chalk.green('UP TO DATE');
        versionInfo = dep.currentVersion;
      }
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
      `${status} ${chalk.white(dep.packageName)} ${chalk.gray(versionInfo)}`
    );
  }
}
