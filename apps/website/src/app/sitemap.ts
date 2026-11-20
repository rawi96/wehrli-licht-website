import { DEDICATED_ROUTES } from '@/domain/content/dedicated-routes';
import { content } from '@/integrations';
import { getAllShopRoutes } from '@/utils/get-shop-routes';
import { getSiteUrl } from '@/utils/site-url';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const contentRoutes = await content.listRoutes();
  const shopRoutes = await getAllShopRoutes();

  // A path can exist both as a CMS page and as a dedicated route (e.g. /shop): keep each URL once.
  const routes = new Map<string, { path: string; lastModified?: string; noIndex?: boolean }>();
  for (const route of [...contentRoutes, ...shopRoutes, ...DEDICATED_ROUTES.map(({ path }) => ({ path }))]) {
    if (!routes.has(route.path)) {
      routes.set(route.path, route);
    }
  }

  return [...routes.values()]
    .filter(({ noIndex }) => !noIndex)
    .map(({ path, lastModified }) => ({ url: `${getSiteUrl()}${path === '/' ? '' : path}`, lastModified }));
}
