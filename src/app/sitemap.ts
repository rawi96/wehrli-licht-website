import { getAllDatoRoutes } from '@/utils/get-dato-routes';
import { getAllShopRoutes } from '@/utils/get-shop-routes';
import { getSiteUrl } from '@/utils/site-url';
import { MetadataRoute } from 'next';

/** Routes rendered by dedicated Next.js pages instead of DatoCMS page records. */
const STATIC_ROUTES = [{ path: '/faq', lastModified: undefined, noIndex: false }];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const datoRoutes = await getAllDatoRoutes({ includeDrafts: false });
  const shopRoutes = await getAllShopRoutes();

  // /shop exists both as a DatoCMS page and as a shop route: keep each URL once.
  const routes = new Map<string, { path: string; lastModified?: string; noIndex?: boolean }>();
  for (const route of [...datoRoutes, ...shopRoutes, ...STATIC_ROUTES]) {
    if (!routes.has(route.path)) {
      routes.set(route.path, route);
    }
  }

  return [...routes.values()]
    .filter(({ noIndex }) => !noIndex)
    .map(({ path, lastModified }) => ({ url: `${getSiteUrl()}${path === '/' ? '' : path}`, lastModified }));
}
