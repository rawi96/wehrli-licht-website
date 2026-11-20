import { catalog, content } from '@/integrations';
import { getShopSitemapRoutes } from '@/domain/shop/sitemap';
import { getSiteUrl } from '@/lib/site-url';
import { MetadataRoute } from 'next';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const contentRoutes = await content.listRoutes();
  const shopRoutes = getShopSitemapRoutes(await catalog.listSitemapEntries());

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
