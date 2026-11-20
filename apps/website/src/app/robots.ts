import { getAllDatoRoutes } from '@/utils/get-dato-routes';
import { getShopSitemapRoutes } from '@/domain/shop/sitemap';
import { catalog } from '@/integrations';
import { getSiteUrl } from '@/utils/site-url';
import { MetadataRoute } from 'next';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const datoRoutes = await getAllDatoRoutes({ includeDrafts: false });
  const shopRoutes = getShopSitemapRoutes(await catalog.listSitemapEntries());

  const routes = [...datoRoutes, ...shopRoutes];

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: routes.filter(({ noIndex }) => noIndex).map(({ path }) => path),
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
