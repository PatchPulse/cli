/**
 * Filters out unknown arguments from the provided args array
 * @param args - The arguments to filter
 * @param validFlags - The list of valid flags
 * @returns Array of unknown arguments (excluding those that come after skip flags)
 */
export function getUnknownArgs(args: string[], validFlags: string[]): string[] {
  const unknownArgs: string[] = [];
  let skipMode = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    // Check if this is a skip flag
    if (arg === '-s' || arg === '--skip') {
      skipMode = true;
      continue;
    }

    // If we're in skip mode and this is not a valid flag, skip it
    if (skipMode && !validFlags.includes(arg)) {
      continue;
    }

    // Reset skip mode when we encounter a valid flag
    if (validFlags.includes(arg)) {
      skipMode = false;
    }

    // Add unknown args that are not in skip mode
    if (!validFlags.includes(arg) && !skipMode) {
      unknownArgs.push(arg);
    }
  }

  return unknownArgs;
}
