export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

export type UpdateType = 'patch' | 'minor' | 'major';

export interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
  bundledDependencies?: Record<string, string>;
}

export interface DependencyInfo {
  packageName: string;
  currentVersion: string;
  latestVersion?: string;
  isOutdated: boolean;
  updateType?: UpdateType;
  isSkipped?: boolean;
  category?: string;
}

/**
 * A dependency that is guaranteed to have latestVersion and updateType fields
 * Used for dependencies that have been filtered and validated for updates
 */
export interface UpdateableDependency {
  packageName: string;
  currentVersion: string;
  latestVersion: string;
  updateType: UpdateType;
  category: string;
}

export interface NpmPackageInfo {
  'dist-tags': {
    latest: string;
  };
  versions: Record<string, object>;
}

export interface VersionInfo {
  major: number;
  minor: number;
  patch: number;
}

export interface CheckOptions {
  concurrency?: number;
  cache?: boolean;
  showSummary?: boolean;
  showProgress?: boolean;
}
