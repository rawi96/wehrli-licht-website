import { getAllDatoRoutes } from '@/utils/get-dato-routes';
import { getAllShopRoutes } from '@/utils/get-shop-routes';
import { getSiteUrl } from '@/utils/site-url';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const datoRoutes = await getAllDatoRoutes({ includeDrafts: false });
  const shopRoutes = await getAllShopRoutes();

  const routes = [...datoRoutes, ...shopRoutes];

  return routes
    .filter(({ noIndex }) => !noIndex)
    .map(({ path, lastModified }) => ({ url: `${getSiteUrl()}${path}`, lastModified }));
}
