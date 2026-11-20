import 'server-only';
import {
  AllShopCategoriesDocument,
  AllShopCategorySlugsDocument,
  AllShopProductSlugsDocument,
  GoogleShoppingFeedProductsDocument,
  ShopAllProductsDocument,
  ShopCategoryBySlugDocument,
  ShopCategoryFragment,
  ShopFeaturedProductsDocument,
  ShopGoogleShoppingProductFragment,
  ShopPageDocument,
  ShopProductBySlugDocument,
  ShopProductDetailFragment,
  ShopProductListItemFragment,
  ShopProductsByCategoryDocument,
  ShopSitemapRoutesDocument,
} from '@/graphql/generated';
import { queryDatoCMS } from '@/integrations/datocms/client';
import { cache } from 'react';

// The shop's DatoCMS queries, cached per request. They return DatoCMS records; the catalog maps them onto the domain.

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

/** The categories shown in the shop, as records (also used by CMS blocks that show categories). */
export const getAllCategories = cache(async (): Promise<ShopCategoryFragment[]> => {
  const { allShopCategories } = await queryDatoCMS({
    document: AllShopCategoriesDocument,
  });

  return allShopCategories;
});

export const getFeaturedShopProducts = cache(async (limit = 8): Promise<ShopProductListItemFragment[]> => {
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

export const getCategoryBySlug = cache(async (slug: string): Promise<ShopCategoryFragment | null> => {
  const { shopCategory } = await queryDatoCMS({
    document: ShopCategoryBySlugDocument,
    variables: { slug },
  });

  return shopCategory ?? null;
});

export const getProductsByCategory = cache(async (categoryId: string): Promise<ShopProductListItemFragment[]> => {
  const { allShopProducts } = await queryDatoCMS({
    document: ShopProductsByCategoryDocument,
    variables: { categoryId },
  });

  return allShopProducts;
});

export const getAllShopProducts = cache(async (): Promise<ShopProductListItemFragment[]> =>
  fetchAllPaginated(async (skip) => {
    const { allShopProducts, meta } = await queryDatoCMS({
      document: ShopAllProductsDocument,
      variables: { skip },
    });

    return { items: allShopProducts, total: meta.count };
  }),
);

export const getProductBySlug = cache(async (slug: string): Promise<ShopProductDetailFragment | null> => {
  const { shopProduct } = await queryDatoCMS({
    document: ShopProductBySlugDocument,
    variables: { slug },
  });

  return shopProduct ?? null;
});

export const getAllCategorySlugs = async (): Promise<string[]> =>
  fetchAllPaginated(async (skip) => {
    const { allShopCategories, meta } = await queryDatoCMS({
      document: AllShopCategorySlugsDocument,
      variables: { skip },
    });

    return { items: allShopCategories.map((category) => category.slug), total: meta.count };
  });

export const getAllProductSlugs = async (): Promise<string[]> =>
  fetchAllPaginated(async (skip) => {
    const { allShopProducts, meta } = await queryDatoCMS({
      document: AllShopProductSlugsDocument,
      variables: { skip },
    });

    return { items: allShopProducts.map((product) => product.slug), total: meta.count };
  });

export const getShopSitemapRecords = async () => {
  const { allShopProducts, allShopCategories } = await queryDatoCMS({
    document: ShopSitemapRoutesDocument,
  });

  return { products: allShopProducts, categories: allShopCategories };
};

export const getGoogleShoppingFeedProducts = async (): Promise<ShopGoogleShoppingProductFragment[]> =>
  fetchAllPaginated(async (skip) => {
    const { allShopProducts, meta } = await queryDatoCMS({
      document: GoogleShoppingFeedProductsDocument,
      variables: { skip },
    });

    return { items: allShopProducts, total: meta.count };
  });
