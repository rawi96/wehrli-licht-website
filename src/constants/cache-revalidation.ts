/**
 * ISR fallback when a page is requested after this interval (seconds).
 * Primary updates come from Dato webhooks → /api/revalidateCache.
 * 1h is a common fallback; increase (e.g. 6 * 60 * 60) if webhooks are reliable.
 */
export const CONTENT_REVALIDATE_SECONDS = 60 * 60;
