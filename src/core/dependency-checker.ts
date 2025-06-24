import chalk from 'chalk';

import { PatchPulseConfig, shouldSkipPackage } from '../services/config';
import { getLatestVersion } from '../services/npm';
import { type DependencyInfo } from '../types';
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
      let updateType: 'patch' | 'minor' | 'major' | undefined;

      if (!isSkipped) {
        latestVersion = await getLatestVersion(packageName);

        // Don't try to compare versions if current version is not a standard semver
        const isStandardSemver = /^\d+\.\d+\.\d+/.test(version);
        if (!isStandardSemver) {
          isOutdated = false;
          updateType = undefined;
        } else if (latestVersion) {
          isOutdated = isVersionOutdated(version, latestVersion);
          updateType = isOutdated
            ? getUpdateType(version, latestVersion)
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
    } else if (dep.currentVersion === 'latest') {
      status = chalk.cyan('LATEST TAG');
      versionInfo = `latest → ${chalk.cyan(dep.latestVersion)} (actual latest version)`;
    } else if (!/^\d+\.\d+\.\d+/.test(dep.currentVersion)) {
      status = chalk.blue('VERSION RANGE');
      versionInfo = `${dep.currentVersion} → ${chalk.cyan(dep.latestVersion)} (latest available)`;
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
