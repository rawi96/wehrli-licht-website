import 'server-only';
import { StructuredTextRenderer } from '@/integrations/datocms/blocks/structured-text';
import { ShopProductsForCheckoutDocument } from '@/graphql/generated';
import type { Catalog } from '@/ports/catalog';
import { queryDatoCMS } from '@/integrations/datocms/client';
import { draftMode } from 'next/headers';
import { toNextMetadata } from 'react-datocms/seo';
import { ShopSections } from '../blocks/shop/shop-sections';
import { findShopCardsSection } from '../blocks/shop/sections';
import { toCategory, toProduct, toProductSummary } from './mapping';
import {
  getAllCategories,
  getAllCategorySlugs,
  getAllProductSlugs,
  getAllShopProducts,
  getCategoryBySlug,
  getFeaturedShopProducts,
  getGoogleShoppingFeedProducts,
  getProductBySlug,
  getProductsByCategory,
  getShopPage,
  getShopSitemapRecords,
} from './queries';
import { toStructuredTextValue } from './structured-text';

/** The catalog kept in DatoCMS: models «Shop Produkt», «Shop Kategorie» and the single «Shop» page. */
export const datocmsCatalog: Catalog = {
  getCheckoutProducts: async (ids) => {
    const { allShopProducts } = await queryDatoCMS({ document: ShopProductsForCheckoutDocument, variables: { ids } });

    return allShopProducts.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price ?? null,
      deliveryTime: product.deliveryTime ?? null,
      shippingCost: product.shippingCost ?? null,
      imageUrl: product.images[0]?.url ?? null,
      variants: product.variants.map((variant) => ({
        price: variant.price ?? null,
        selections: variant.selections.map(({ option, value }) => ({ option, value })),
      })),
    }));
  },

  listProducts: async () => (await getAllShopProducts()).map(toProductSummary),

  listFeaturedProducts: async () => (await getFeaturedShopProducts()).map(toProductSummary),

  getProduct: async (slug) => {
    const record = await getProductBySlug(slug);

    if (!record) {
      return null;
    }

    const description = toStructuredTextValue(record.description);

    return {
      product: toProduct(record),
      description: description ? <StructuredTextRenderer data={description} /> : null,
    };
  },

  listProductSlugs: getAllProductSlugs,

  listCategories: async () => (await getAllCategories()).map(toCategory),

  getCategory: async (slug) => {
    const record = await getCategoryBySlug(slug);

    if (!record) {
      return null;
    }

    const products = await getProductsByCategory(record.id);

    return { category: toCategory(record), products: products.map(toProductSummary) };
  },

  listCategorySlugs: getAllCategorySlugs,

  getShopStartPage: async () => {
    const { isEnabled } = await draftMode();
    const [categories, featuredProducts, { site, shopPage }] = await Promise.all([
      datocmsCatalog.listCategories(),
      datocmsCatalog.listFeaturedProducts(),
      getShopPage(isEnabled),
    ]);

    if (!shopPage?.sections.length) {
      return null;
    }

    const serviceSection = findShopCardsSection(shopPage.sections);

    return {
      metadata: shopPage.seo.length ? toNextMetadata([...site.favicon, ...shopPage.seo]) : null,
      content: <ShopSections sections={shopPage.sections} categories={categories} featuredProducts={featuredProducts} />,
      // Only tiles with a text are questions with an answer; an empty answer is invalid structured data.
      faq: (serviceSection?.items ?? []).flatMap((item) =>
        item.text?.trim() ? [{ question: item.title, answer: item.text.trim() }] : [],
      ),
    };
  },

  listSitemapEntries: async () => {
    const { categories, products } = await getShopSitemapRecords();
    const toEntry = (record: { slug: string; _updatedAt: string; seoNoindex: boolean | null }) => ({
      slug: record.slug,
      updatedAt: record._updatedAt,
      noIndex: record.seoNoindex ?? false,
    });

    return { categories: categories.map(toEntry), products: products.map(toEntry) };
  },

  listFeedProducts: async () => (await getGoogleShoppingFeedProducts()).map(toProduct),
};
