/**
 * Routes rendered by dedicated Next.js pages instead of the DatoCMS catch-all. A DatoCMS page with
 * the same path is not prerendered by the catch-all and not listed twice in sitemap or llms.txt.
 */
export const DEDICATED_ROUTES = [
  { path: '/shop', title: 'Online-Shop' },
  { path: '/faq', title: 'Häufige Fragen (FAQ)' },
] as const;

export const isDedicatedRoute = (path: string): boolean =>
  path === '/' || DEDICATED_ROUTES.some((route) => route.path === path);
