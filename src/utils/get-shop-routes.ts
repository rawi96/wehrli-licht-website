import { getAllCategories, getAllProducts } from './shop';

type Route = {
  path: string;
  lastModified: string;
  noIndex?: boolean;
};

export const getAllShopRoutes = async (): Promise<Route[]> => {
  const categories = await getAllCategories(); // /shop/kategorien/:slug
  const products = await getAllProducts(); // /shop/produkte/:slug

  const categoryPages = categories.map(({ slug }) => ({
    path: `/shop/kategorien/${slug}`,
    lastModified: new Date().toISOString(),
    noIndex: false,
  }));

  const productPages = products.map(({ slug }) => ({
    path: `/shop/produkte/${slug}`,
    lastModified: new Date().toISOString(),
    noIndex: false,
  }));

  const pages = [...categoryPages, ...productPages];

  return pages;
};
