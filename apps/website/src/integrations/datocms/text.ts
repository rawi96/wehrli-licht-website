/** Multi-line CMS text field («one entry per line») to a list of non-empty, trimmed lines. */
export const toLines = (text: string | null | undefined): string[] =>
  (text ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
