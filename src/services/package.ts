import { existsSync, readFileSync } from 'fs';

import { type PackageJson } from '../utils';

export async function readPackageJson(path: string): Promise<PackageJson> {
  if (!existsSync(path)) {
    throw new Error(`package.json not found at ${path}`);
  }

  try {
    const contents = readFileSync(path, 'utf-8');
    const parsed = JSON.parse(contents);

    // Validate that it's actually a package.json
    if (typeof parsed !== 'object' || parsed === null) {
      throw new Error('package.json must be a valid JSON object');
    }

    return parsed;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON in package.json: ${error.message}`);
    }
    throw new Error(`Error reading package.json: ${error}`);
  }
}
