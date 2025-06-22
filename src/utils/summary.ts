import chalk from 'chalk';
import { DependencyInfo } from '../types';

export function displaySummary(allDependencies: DependencyInfo[]): void {
  const total = allDependencies.length;
  const upToDate = allDependencies.filter(d => !d.isOutdated).length;
  const outdated = allDependencies.filter(d => d.isOutdated).length;
  const unknown = allDependencies.filter(d => !d.latestVersion).length;

  const majorUpdates = allDependencies.filter(
    d => d.updateType === 'major'
  ).length;
  const minorUpdates = allDependencies.filter(
    d => d.updateType === 'minor'
  ).length;
  const patchUpdates = allDependencies.filter(
    d => d.updateType === 'patch'
  ).length;

  console.log(chalk.gray('═'.repeat(60)));
  console.log(chalk.cyan.bold(`📊 Summary (${total} packages)`));
  console.log(chalk.gray('═'.repeat(60)));

  console.log(`  ${chalk.green.bold('✓  Up to date:')} ${upToDate}`);

  const buildBreakdownText = (): string => {
    const breakdown = [];
    if (majorUpdates > 0) breakdown.push(`${majorUpdates} major`);
    if (minorUpdates > 0) breakdown.push(`${minorUpdates} minor`);
    if (patchUpdates > 0) breakdown.push(`${patchUpdates} patch`);

    return breakdown.length > 0
      ? ` ${chalk.gray(`(${breakdown.join(', ')})`)}`
      : '';
  };

  const breakdownText = outdated > 0 ? buildBreakdownText() : '';
  console.log(
    `  ${chalk.blueBright.bold('⚠  Outdated:')} ${outdated}${breakdownText}`
  );

  console.log(`  ${chalk.magenta.bold('?  Unknown:')} ${unknown}`);

  console.log(chalk.gray('═'.repeat(60)));
}
