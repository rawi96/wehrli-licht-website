import { content } from '@/integrations';
import { getAllShopRoutes } from '@/utils/get-shop-routes';
import { getSiteUrl } from '@/utils/site-url';
import { MetadataRoute } from 'next';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const contentRoutes = await content.listRoutes();
  const shopRoutes = await getAllShopRoutes();

  const routes = [...contentRoutes, ...shopRoutes];

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: routes.filter(({ noIndex }) => noIndex).map(({ path }) => path),
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
