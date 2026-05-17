/**
 * ISR fallback when a page is requested after this interval (seconds).
 * Primary updates come from Dato webhooks → /api/revalidateCache.
 *
 * Must be a compile-time literal in `export const revalidate` (Next.js segment config).
 * Update this value and every `export const revalidate = …` in app routes together.
 */
export const CONTENT_REVALIDATE_SECONDS = 3600;
