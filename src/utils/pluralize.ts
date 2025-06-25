interface PluralizeArgs {
  /**
   * The count of the word
   */
  count: number;
  /**
   * The singular form of the word
   */
  singular: string;
  /**
   * The plural form of the word
   */
  plural: string;
}

/**
 * Pluralizes a word based on the count
 * @returns The pluralized word
 */
export function pluralize({ count, singular, plural }: PluralizeArgs): string {
  return count === 1 ? singular : plural;
}
