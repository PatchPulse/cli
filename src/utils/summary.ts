import chalk from 'chalk';
import { DependencyInfo } from '../types';

export function displaySummary(allDependencies: DependencyInfo[]): void {
  const total = allDependencies.length;
  const upToDate = allDependencies.filter(
    d => !d.isOutdated && !d.isSkipped && d.latestVersion
  ).length;
  const unknown = allDependencies.filter(
    d => !d.latestVersion && !d.isSkipped
  ).length;
  const outdated = allDependencies.filter(
    d => d.isOutdated && !d.isSkipped
  ).length;
  const skipped = allDependencies.filter(d => d.isSkipped).length;

  // Count by update type (only for non-skipped packages)
  const majorUpdates = allDependencies.filter(
    d => d.updateType === 'major' && !d.isSkipped
  ).length;
  const minorUpdates = allDependencies.filter(
    d => d.updateType === 'minor' && !d.isSkipped
  ).length;
  const patchUpdates = allDependencies.filter(
    d => d.updateType === 'patch' && !d.isSkipped
  ).length;

  console.log(chalk.gray('═'.repeat(60)));
  console.log(chalk.cyan.bold(`📊 Summary (${total} packages)`));
  console.log(chalk.gray('═'.repeat(60)));

  if (upToDate > 0) {
    console.log(`  ${chalk.green('✓  Up to date:')} ${upToDate}`);
  }

  if (outdated > 0) {
    const breakdown = [
      majorUpdates > 0 && `${majorUpdates} major`,
      minorUpdates > 0 && `${minorUpdates} minor`,
      patchUpdates > 0 && `${patchUpdates} patch`,
    ].filter(Boolean);

    const breakdownText =
      breakdown.length > 0 ? ` ${chalk.gray(`(${breakdown.join(', ')})`)}` : '';
    console.log(`  ${chalk.blue('⚠  Outdated:')} ${outdated}${breakdownText}`);
  }

  if (unknown > 0) {
    console.log(`  ${chalk.magenta('?  Unknown:')} ${unknown}`);
  }

  if (skipped > 0) {
    console.log(`  ${chalk.gray('⏭  Skipped:')} ${skipped}`);
  }

  console.log(chalk.gray('═'.repeat(60)));
}
