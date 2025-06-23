import { VERSION } from '../gen/version.gen';

export interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
  bundledDependencies?: Record<string, string>;
}

export interface DependencyInfo {
  name: string;
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

// Runtime exports for ES module compatibility
export const PATCH_PULSE_UTILS_VERSION = VERSION;

// Re-export types as runtime values for compatibility
export const Types = {
  PackageJson: 'PackageJson',
  DependencyInfo: 'DependencyInfo',
  NpmPackageInfo: 'NpmPackageInfo',
  VersionInfo: 'VersionInfo',
  CheckOptions: 'CheckOptions',
} as const;
