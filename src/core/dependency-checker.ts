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

  // Use the ProgressSpinner class
  const progress = new ProgressSpinner();
  progress.start(`Checking ${packageNames.length} packages...`);

  // Process all packages in parallel with concurrency limit
  const concurrencyLimit = 10;
  const dependencyInfos: DependencyInfo[] = [];

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

    // Update progress message with current count
    const processedCount = Math.min(i + concurrencyLimit, packageNames.length);
    progress.updateMessage(
      `Checking ${packageNames.length} packages... (${processedCount}/${packageNames.length})`
    );
  }

  // Stop progress indicator
  progress.stop();

  // Sort and display results
  dependencyInfos.sort((a, b) => a.name.localeCompare(b.name));
  displayResults(dependencyInfos);
  console.log();

  return dependencyInfos;
}

function displayResults(dependencyInfos: DependencyInfo[]): void {
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
