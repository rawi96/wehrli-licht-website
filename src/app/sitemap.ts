import { getAllDatoRoutes } from '@/utils/get-dato-routes';
import { getAllShopRoutes } from '@/utils/get-shop-routes';
import { getSiteUrl } from '@/utils/site-url';
import { MetadataRoute } from 'next';
import { DEDICATED_ROUTES } from '@/constants/dedicated-routes';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const datoRoutes = await getAllDatoRoutes({ includeDrafts: false });
  const shopRoutes = await getAllShopRoutes();

  // A path can exist both as a DatoCMS page and as a dedicated route (e.g. /shop): keep each URL once.
  const routes = new Map<string, { path: string; lastModified?: string; noIndex?: boolean }>();
  for (const route of [...datoRoutes, ...shopRoutes, ...DEDICATED_ROUTES.map(({ path }) => ({ path }))]) {
    if (!routes.has(route.path)) {
      routes.set(route.path, route);
    }
  }

  return [...routes.values()]
    .filter(({ noIndex }) => !noIndex)
    .map(({ path, lastModified }) => ({ url: `${getSiteUrl()}${path === '/' ? '' : path}`, lastModified }));
}
