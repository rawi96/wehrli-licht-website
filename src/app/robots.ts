import { getAllDatoRoutes } from '@/utils/get-dato-routes';
import { getAllShopRoutes } from '@/utils/get-shop-routes';
import { MetadataRoute } from 'next';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const datoRoutes = await getAllDatoRoutes({ includeDrafts: false });
  const shopRoutes = await getAllShopRoutes();

  const routes = [...datoRoutes, ...shopRoutes];

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: routes.filter(({ noIndex }) => noIndex).map(({ path }) => path),
    },
    sitemap: `https://wehrli-licht.ch/sitemap.xml`,
  };
}
