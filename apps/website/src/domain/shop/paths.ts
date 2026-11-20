// URLs of the shop's pages.

export const SHOP_HOME_PATH = '/shop';
export const SHOP_ALL_PRODUCTS_PATH = '/shop/alle-leuchten';

export const getShopCategoryPath = (slug: string): string => `/shop/kategorien/${slug}`;

export const getShopProductPath = (slug: string, basePath = SHOP_HOME_PATH): string => `${basePath}/produkte/${slug}`;
