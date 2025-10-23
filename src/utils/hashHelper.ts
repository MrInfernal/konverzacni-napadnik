/**
 * Simple hash function for detecting changes in question arrays
 */
export function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Generate hash for array of questions
 */
export function hashQuestions(questions: string[]): string {
  // Create a string representation of all questions
  const combined = questions.join('|');
  return simpleHash(combined);
}

/**
 * Generate hashes for all categories
 */
export function generateCategoryHashes(categories: any[]): Record<string, string> {
  const hashes: Record<string, string> = {};

  categories.forEach(category => {
    hashes[category.id] = hashQuestions(category.questions);
  });

  return hashes;
}
