interface CacheEntry {
  version: string;
  timestamp: number;
}

class PackageCache {
  private cache = new Map<string, CacheEntry>();
  private readonly PACKAGE_TTL = 5 * 60 * 1000; // 5 minutes for packages
  private readonly CLI_TTL = 60 * 60 * 1000; // 1 hour for CLI updates

  get(packageName: string): string | null {
    const entry = this.cache.get(packageName);
    const ttl = packageName === 'patch-pulse' ? this.CLI_TTL : this.PACKAGE_TTL;

    if (entry && Date.now() - entry.timestamp < ttl) {
      return entry.version;
    }
    return null;
  }

  set(packageName: string, version: string): void {
    this.cache.set(packageName, {
      version,
      timestamp: Date.now(),
    });
  }
}

export const packageCache = new PackageCache();
