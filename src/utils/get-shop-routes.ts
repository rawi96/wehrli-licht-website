import { getShopSitemapRoutes } from '@/utils/shop';

type Route = {
  path: string;
  lastModified: string;
  noIndex?: boolean;
};

export const getAllShopRoutes = async (): Promise<Route[]> => {
  const routes = await getShopSitemapRoutes();

  return routes.map(({ path, lastModified, noIndex }) => ({
    path,
    lastModified,
    noIndex,
  }));
};
