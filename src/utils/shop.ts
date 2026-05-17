import {
  AllShopCategoriesDocument,
  AllShopCategorySlugsDocument,
  AllShopProductSlugsDocument,
  ShopCategoryBySlugDocument,
  ShopProductBySlugDocument,
  ShopProductsByCategoryDocument,
  ShopSitemapRoutesDocument,
  ShopCategoryFragment,
  ShopProductDetailFragment,
  ShopProductListItemFragment,
} from '@/graphql/generated';
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

async function fetchAllSlugs(queryFn: (skip: number) => Promise<{ slugs: string[]; total: number }>): Promise<string[]> {
  const pageSize = 100;
  const first = await queryFn(0);
  const slugs = [...first.slugs];

  for (let skip = pageSize; skip < first.total; skip += pageSize) {
    const page = await queryFn(skip);
    slugs.push(...page.slugs);
  }

  return slugs;
}

export async function getAllCategories(): Promise<ShopCategory[]> {
  const { allShopCategories } = await queryDatoCMS({
    document: AllShopCategoriesDocument,
  });

  return allShopCategories;
}

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

export const getProductBySlug = cache(async (slug: string): Promise<ShopProduct | null> => {
  const { shopProduct } = await queryDatoCMS({
    document: ShopProductBySlugDocument,
    variables: { slug },
  });

  return shopProduct ?? null;
});

export async function getAllCategorySlugs(): Promise<string[]> {
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
}

export async function getAllProductSlugs(): Promise<string[]> {
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
}

export async function getShopSitemapRoutes(): Promise<ShopSitemapRoute[]> {
  const { allShopProducts, allShopCategories } = await queryDatoCMS({
    document: ShopSitemapRoutesDocument,
  });

  const shopIndex: ShopSitemapRoute = {
    path: '/shop',
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

  return [shopIndex, ...categories, ...products];
}
