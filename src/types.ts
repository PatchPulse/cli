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
  updateType?: 'patch' | 'minor' | 'major';
  isSkipped?: boolean;
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
