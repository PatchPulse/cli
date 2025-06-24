/**
 * Pluralizes a word based on the count
 * @param count - The count of the word
 * @param singular - The singular form of the word
 * @param plural - The plural form of the word
 * @returns The pluralized word
 */
export function pluralize(
  count: number,
  singular: string,
  plural: string
): string {
  return count === 1 ? singular : plural;
}
