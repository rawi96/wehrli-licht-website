/**
 * Routes rendered by dedicated Next.js pages instead of the CMS catch-all. A CMS page with
 * the same path is not prerendered by the catch-all and not listed twice in sitemap or llms.txt.
 */
export const DEDICATED_ROUTES = [
  { path: '/shop', title: 'Online-Shop' },
  { path: '/faq', title: 'Häufige Fragen (FAQ)' },
] as const;

/** Path prefixes served by dedicated Next.js routes: projects and project areas (/projekte/<slug>). */
const DEDICATED_PREFIXES = ['/projekte/'] as const;

export const isDedicatedRoute = (path: string): boolean =>
  path === '/' ||
  DEDICATED_ROUTES.some((route) => route.path === path) ||
  DEDICATED_PREFIXES.some((prefix) => path.startsWith(prefix));
