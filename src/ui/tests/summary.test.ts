import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type DependencyInfo } from '../../utils';
import { displaySummary } from '../summary';

describe('displaySummary', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should display summary with all dependency types', () => {
    const dependencies: DependencyInfo[] = [
      {
        name: 'chalk',
        currentVersion: '5.0.0',
        latestVersion: '5.0.0',
        isOutdated: false,
        isSkipped: false,
      },
      {
        name: 'lodash',
        currentVersion: '4.17.0',
        latestVersion: '4.17.21',
        isOutdated: true,
        updateType: 'patch',
        isSkipped: false,
      },
      {
        name: 'express',
        currentVersion: '4.17.0',
        latestVersion: '4.18.0',
        isOutdated: true,
        updateType: 'minor',
        isSkipped: false,
      },
      {
        name: 'react',
        currentVersion: '17.0.0',
        latestVersion: '18.0.0',
        isOutdated: true,
        updateType: 'major',
        isSkipped: false,
      },
      {
        name: 'unknown-pkg',
        currentVersion: '1.0.0',
        latestVersion: undefined,
        isOutdated: false,
        isSkipped: false,
      },
      {
        name: 'skipped-pkg',
        currentVersion: '1.0.0',
        latestVersion: '2.0.0',
        isOutdated: true,
        isSkipped: true,
      },
    ];

    displaySummary(dependencies);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('📊 Summary (6 packages)')
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('✓  Up to date: 1')
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('⚠  Outdated: 3 (1 major, 1 minor, 1 patch)')
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('?  Unknown: 1')
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('⏭  Skipped: 1')
    );
  });

  it('should display summary with only up-to-date packages', () => {
    const dependencies: DependencyInfo[] = [
      {
        name: 'chalk',
        currentVersion: '5.0.0',
        latestVersion: '5.0.0',
        isOutdated: false,
        isSkipped: false,
      },
      {
        name: 'lodash',
        currentVersion: '4.17.21',
        latestVersion: '4.17.21',
        isOutdated: false,
        isSkipped: false,
      },
    ];

    displaySummary(dependencies);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('📊 Summary (2 packages)')
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('✓  Up to date: 2')
    );
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('⚠  Outdated:')
    );
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('?  Unknown:')
    );
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('⏭  Skipped:')
    );
  });

  it('should display summary with only outdated packages', () => {
    const dependencies: DependencyInfo[] = [
      {
        name: 'lodash',
        currentVersion: '4.17.0',
        latestVersion: '4.17.21',
        isOutdated: true,
        updateType: 'patch',
        isSkipped: false,
      },
      {
        name: 'express',
        currentVersion: '4.17.0',
        latestVersion: '4.18.0',
        isOutdated: true,
        updateType: 'minor',
        isSkipped: false,
      },
      {
        name: 'react',
        currentVersion: '17.0.0',
        latestVersion: '18.0.0',
        isOutdated: true,
        updateType: 'major',
        isSkipped: false,
      },
    ];

    displaySummary(dependencies);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('📊 Summary (3 packages)')
    );
    // Should not show categories with 0 items
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('✓  Up to date:')
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('⚠  Outdated: 3 (1 major, 1 minor, 1 patch)')
    );
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('?  Unknown:')
    );
  });

  it('should display summary with only unknown packages', () => {
    const dependencies: DependencyInfo[] = [
      {
        name: 'unknown-pkg1',
        currentVersion: '1.0.0',
        latestVersion: undefined,
        isOutdated: false,
        isSkipped: false,
      },
      {
        name: 'unknown-pkg2',
        currentVersion: '2.0.0',
        latestVersion: undefined,
        isOutdated: false,
        isSkipped: false,
      },
    ];

    displaySummary(dependencies);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('📊 Summary (2 packages)')
    );
    // Should not show categories with 0 items
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('✓  Up to date:')
    );
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('⚠  Outdated:')
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('?  Unknown: 2')
    );
  });

  it('should display summary with only skipped packages', () => {
    const dependencies: DependencyInfo[] = [
      {
        name: 'skipped-pkg1',
        currentVersion: '1.0.0',
        latestVersion: '2.0.0',
        isOutdated: true,
        isSkipped: true,
      },
      {
        name: 'skipped-pkg2',
        currentVersion: '1.0.0',
        latestVersion: '1.0.0',
        isOutdated: false,
        isSkipped: true,
      },
    ];

    displaySummary(dependencies);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('📊 Summary (2 packages)')
    );
    // Should not show categories with 0 items
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('✓  Up to date:')
    );
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('⚠  Outdated:')
    );
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('?  Unknown:')
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('⏭  Skipped: 2')
    );
  });

  it('should handle empty dependencies array', () => {
    displaySummary([]);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('📊 Summary (0 packages)')
    );
    // Should not show any categories when all counts are 0
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('✓  Up to date:')
    );
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('⚠  Outdated:')
    );
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('?  Unknown:')
    );
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('⏭  Skipped:')
    );
  });

  it('should handle outdated packages without update type breakdown', () => {
    const dependencies: DependencyInfo[] = [
      {
        name: 'lodash',
        currentVersion: '4.17.0',
        latestVersion: '4.17.21',
        isOutdated: true,
        isSkipped: false,
      }, // no updateType
    ];

    displaySummary(dependencies);

    const outdatedCall = consoleSpy.mock.calls.find(
      call => typeof call[0] === 'string' && call[0].includes('⚠  Outdated:')
    );
    expect(outdatedCall && outdatedCall[0]).not.toContain('(');
  });

  it('should handle mixed update types correctly', () => {
    const dependencies: DependencyInfo[] = [
      {
        name: 'major1',
        currentVersion: '1.0.0',
        latestVersion: '2.0.0',
        isOutdated: true,
        updateType: 'major',
        isSkipped: false,
      },
      {
        name: 'major2',
        currentVersion: '1.0.0',
        latestVersion: '3.0.0',
        isOutdated: true,
        updateType: 'major',
        isSkipped: false,
      },
      {
        name: 'minor1',
        currentVersion: '1.0.0',
        latestVersion: '1.1.0',
        isOutdated: true,
        updateType: 'minor',
        isSkipped: false,
      },
      {
        name: 'patch1',
        currentVersion: '1.0.0',
        latestVersion: '1.0.1',
        isOutdated: true,
        updateType: 'patch',
        isSkipped: false,
      },
      {
        name: 'patch2',
        currentVersion: '1.0.0',
        latestVersion: '1.0.2',
        isOutdated: true,
        updateType: 'patch',
        isSkipped: false,
      },
    ];

    displaySummary(dependencies);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('⚠  Outdated: 5 (2 major, 1 minor, 2 patch)')
    );
  });

  it('should exclude skipped packages from up-to-date and unknown counts', () => {
    const dependencies: DependencyInfo[] = [
      {
        name: 'up-to-date',
        currentVersion: '1.0.0',
        latestVersion: '1.0.0',
        isOutdated: false,
        isSkipped: false,
      },
      {
        name: 'up-to-date-skipped',
        currentVersion: '1.0.0',
        latestVersion: '1.0.0',
        isOutdated: false,
        isSkipped: true,
      },
      {
        name: 'unknown',
        currentVersion: '1.0.0',
        latestVersion: undefined,
        isOutdated: false,
        isSkipped: false,
      },
      {
        name: 'unknown-skipped',
        currentVersion: '1.0.0',
        latestVersion: undefined,
        isOutdated: false,
        isSkipped: true,
      },
    ];

    displaySummary(dependencies);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('✓  Up to date: 1')
    ); // Only non-skipped
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('?  Unknown: 1')
    ); // Only non-skipped
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('⏭  Skipped: 2')
    );
  });

  it('should include skipped packages in total count', () => {
    const dependencies: DependencyInfo[] = [
      {
        name: 'pkg1',
        currentVersion: '1.0.0',
        latestVersion: '1.0.0',
        isOutdated: false,
        isSkipped: false,
      },
      {
        name: 'pkg2',
        currentVersion: '1.0.0',
        latestVersion: '2.0.0',
        isOutdated: true,
        isSkipped: true,
      },
    ];

    displaySummary(dependencies);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('📊 Summary (2 packages)')
    );
  });
});
