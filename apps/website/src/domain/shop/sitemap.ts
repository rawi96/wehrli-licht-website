import { getShopCategoryPath, getShopProductPath, SHOP_ALL_PRODUCTS_PATH, SHOP_HOME_PATH } from '@/domain/shop/paths';

/** A category or product for the sitemap: when it last changed and whether search engines should skip it. */
export type CatalogSitemapEntry = {
  slug: string;
  /** ISO date and time */
  updatedAt: string;
  noIndex: boolean;
};

export type ShopSitemapRoute = {
  path: string;
  lastModified: string;
  noIndex: boolean;
};

/** The shop's pages for sitemap and robots.txt: start page, all products, every category and product. */
export const getShopSitemapRoutes = (
  { categories, products }: { categories: CatalogSitemapEntry[]; products: CatalogSitemapEntry[] },
  now: Date = new Date(),
): ShopSitemapRoute[] => [
  { path: SHOP_HOME_PATH, lastModified: now.toISOString(), noIndex: false },
  { path: SHOP_ALL_PRODUCTS_PATH, lastModified: now.toISOString(), noIndex: false },
  ...categories.map(({ slug, updatedAt, noIndex }) => ({
    path: getShopCategoryPath(slug),
    lastModified: updatedAt,
    noIndex,
  })),
  ...products.map(({ slug, updatedAt, noIndex }) => ({ path: getShopProductPath(slug), lastModified: updatedAt, noIndex })),
];
