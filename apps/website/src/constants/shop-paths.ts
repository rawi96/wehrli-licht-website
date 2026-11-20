export const SHOP_HOME_PATH = '/shop';
export const SHOP_ALL_PRODUCTS_PATH = '/shop/alle-leuchten';
export const SHOP_OFFERS_PATH = '/angebot';
export const LICHTBERATUNG_PATH = '/angebot/lichtberatung';
export const LICHTPLANUNG_PATH = '/angebot/lichtplanung';
export const LAMPENSCHIRME_PATH = '/angebot/lampenschirme';
export const KONTAKT_TERMIN_PATH = '/kontakt#termin';

export const getShopCategoryPath = (slug: string): string => `/shop/kategorien/${slug}`;

export const getShopProductPath = (slug: string, basePath = SHOP_HOME_PATH): string => `${basePath}/produkte/${slug}`;
