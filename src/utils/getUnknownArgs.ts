/**
 * Filters out unknown arguments from the provided args array
 * @param args - The arguments to filter
 * @param validFlags - The list of valid flags
 * @returns Array of unknown arguments (excluding those that come after skip flags)
 */
export function getUnknownArgs(args: string[], validFlags: string[]): string[] {
  const unknownArgs: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (!validFlags.includes(arg)) {
      // Check if this argument comes after -s or --skip
      const isAfterSkip =
        i > 0 && (args[i - 1] === '-s' || args[i - 1] === '--skip');
      if (!isAfterSkip) {
        unknownArgs.push(arg);
      }
    }
  }

  return unknownArgs;
}
