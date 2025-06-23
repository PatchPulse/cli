/**
 * Checks if any of the given flags are present in args
 * @param args - The arguments to check
 * @param flags - The flags to check for
 * @returns True if any of the flags are present in args, false otherwise
 */
export function hasAnyFlag(args: string[], flags: string[]): boolean {
  const flagSet = new Set(flags);
  return args.some(arg => flagSet.has(arg));
}
