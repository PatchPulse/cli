/**
 * Patch Pulse Configuration Types
 *
 * These types provide intellisense support for .patchpulserc files
 * when using TypeScript-aware editors or when importing in TypeScript projects.
 */

declare module 'patch-pulse-config' {
  /**
   * Main configuration interface for Patch Pulse CLI
   */
  export interface PatchPulseConfig {
    /**
     * Array of package names or patterns to skip during dependency checking
     *     * Supports:
     * - Exact package names: "lodash"
     * - Glob patterns: "@types/*", "test-*"
     * - Regex patterns: ".*-dev", "^@angular/.*"
     *
     * @example
     * ```json
     * {
     *   "skip": ["lodash", "@types/*", "test-*"]
     * }
     * ```
     */
    skip?: string[];
  }

  /**
   * CLI-specific configuration options
   */
  export interface CliConfig {
    /**
     * Packages to skip (overrides file config)
     */
    skip?: string[];
  }

  /**
   * Merged configuration from file and CLI
   */
  export interface MergedConfig {
    /**
     * Final list of packages to skip
     */
    skip: string[];
  }
}

// Global type augmentation for better IDE support
declare global {
  /**
   * Patch Pulse configuration types for global use
   */
  namespace PatchPulse {
    interface Config {
      /**
       * Array of package names or patterns to skip during dependency checking
       *
       * Supports exact names, glob patterns (*, ?), and regex patterns
       *
       * @example
       * ```json
       * {
       *   "skip": ["lodash", "@types/*", "test-*"]
       * }
       * ```
       */
      skip?: string[];
    }
  }
}
