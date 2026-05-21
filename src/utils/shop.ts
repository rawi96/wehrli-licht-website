import {
  AllShopCategoriesDocument,
  AllShopCategorySlugsDocument,
  AllShopProductSlugsDocument,
  ShopAllProductsDocument,
  ShopCategoryBySlugDocument,
  ShopFeaturedProductsDocument,
  ShopPageDocument,
  ShopProductBySlugDocument,
  ShopProductsByCategoryDocument,
  ShopSitemapRoutesDocument,
  ShopCategoryFragment,
  ShopProductDetailFragment,
  ShopProductListItemFragment,
} from '@/graphql/generated';
import { SHOP_ALL_PRODUCTS_PATH } from '@/constants/shop-paths';
import { queryDatoCMS } from '@/utils/query-dato-cms';
import { cache } from 'react';

export type ShopCategory = ShopCategoryFragment;
export type ShopProductListItem = ShopProductListItemFragment;
export type ShopProduct = ShopProductDetailFragment;

export type ShopSitemapRoute = {
  path: string;
  lastModified: string;
  noIndex: boolean;
};

const PAGE_SIZE = 100;

const fetchAllPaginated = async <T>(queryFn: (skip: number) => Promise<{ items: T[]; total: number }>): Promise<T[]> => {
  const first = await queryFn(0);
  const items = [...first.items];

  for (let skip = PAGE_SIZE; skip < first.total; skip += PAGE_SIZE) {
    const page = await queryFn(skip);
    items.push(...page.items);
  }

  return items;
};

const fetchAllSlugs = async (queryFn: (skip: number) => Promise<{ slugs: string[]; total: number }>): Promise<string[]> => {
  const slugs = await fetchAllPaginated(async (skip) => {
    const result = await queryFn(skip);

    return { items: result.slugs, total: result.total };
  });

  return slugs;
};

export const getAllCategories = cache(async (): Promise<ShopCategory[]> => {
  const { allShopCategories } = await queryDatoCMS({
    document: AllShopCategoriesDocument,
  });

  return allShopCategories;
});

export const getFeaturedShopProducts = cache(async (limit = 8): Promise<ShopProductListItem[]> => {
  const { allShopProducts } = await queryDatoCMS({
    document: ShopFeaturedProductsDocument,
  });

  return allShopProducts.slice(0, limit);
});

export const getShopPage = cache(async (includeDrafts = false) => {
  const { site, shopPage } = await queryDatoCMS({
    document: ShopPageDocument,
    includeDrafts,
  });

  return { site, shopPage };
});

export const getCategoryBySlug = cache(async (slug: string): Promise<ShopCategory | null> => {
  const { shopCategory } = await queryDatoCMS({
    document: ShopCategoryBySlugDocument,
    variables: { slug },
  });

  return shopCategory ?? null;
});

export const getProductsByCategory = cache(async (categoryId: string): Promise<ShopProductListItem[]> => {
  const { allShopProducts } = await queryDatoCMS({
    document: ShopProductsByCategoryDocument,
    variables: { categoryId },
  });

  return allShopProducts;
});

export const getAllShopProducts = cache(
  async (): Promise<ShopProductListItem[]> =>
    fetchAllPaginated(async (skip) => {
      const { allShopProducts, meta } = await queryDatoCMS({
        document: ShopAllProductsDocument,
        variables: { skip },
      });

      return { items: allShopProducts, total: meta.count };
    }),
);

export const getProductBySlug = cache(async (slug: string): Promise<ShopProduct | null> => {
  const { shopProduct } = await queryDatoCMS({
    document: ShopProductBySlugDocument,
    variables: { slug },
  });

  return shopProduct ?? null;
});

export const getAllCategorySlugs = async (): Promise<string[]> => {
  return fetchAllSlugs(async (skip) => {
    const { allShopCategories, meta } = await queryDatoCMS({
      document: AllShopCategorySlugsDocument,
      variables: { skip },
    });

    return {
      slugs: allShopCategories.map((category) => category.slug),
      total: meta.count,
    };
  });
};

export const getAllProductSlugs = async (): Promise<string[]> => {
  return fetchAllSlugs(async (skip) => {
    const { allShopProducts, meta } = await queryDatoCMS({
      document: AllShopProductSlugsDocument,
      variables: { skip },
    });

    return {
      slugs: allShopProducts.map((product) => product.slug),
      total: meta.count,
    };
  });
};

export const getShopSitemapRoutes = async (): Promise<ShopSitemapRoute[]> => {
  const { allShopProducts, allShopCategories } = await queryDatoCMS({
    document: ShopSitemapRoutesDocument,
  });

  const shopIndex: ShopSitemapRoute = {
    path: '/shop',
    lastModified: new Date().toISOString(),
    noIndex: false,
  };

  const allProducts: ShopSitemapRoute = {
    path: SHOP_ALL_PRODUCTS_PATH,
    lastModified: new Date().toISOString(),
    noIndex: false,
  };

  const categories = allShopCategories.map((category) => ({
    path: `/shop/kategorien/${category.slug}`,
    lastModified: category._updatedAt,
    noIndex: category.seoNoindex ?? false,
  }));

  const products = allShopProducts.map((product) => ({
    path: `/shop/produkte/${product.slug}`,
    lastModified: product._updatedAt,
    noIndex: product.seoNoindex ?? false,
  }));

  return [shopIndex, allProducts, ...categories, ...products];
};
