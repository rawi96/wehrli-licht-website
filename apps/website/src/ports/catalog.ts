import type { Category } from '@/domain/shop/category';
import type { CheckoutProduct } from '@/domain/shop/checkout-product';
import type { PageMetadata } from '@/domain/shop/page-metadata';
import type { Product, ProductSummary } from '@/domain/shop/product';
import type { CatalogSitemapEntry } from '@/domain/shop/sitemap';
import type { ReactNode } from 'react';

/** A product for its page: the product and its rich text description, rendered (null when it has none). */
export type ProductWithDescription = {
  product: Product;
  description: ReactNode;
};

/** A category with its products, sorted by name. */
export type CategoryWithProducts = {
  category: Category;
  products: ProductSummary[];
};

/** The shop's start page as maintained in the catalog's CMS. */
export type ShopStartPage = {
  /** From the page's SEO settings, with the site's favicons; null when none are set (the shop's default applies). */
  metadata: PageMetadata | null;
  /** The page's sections (hero, categories, featured products, services), rendered. */
  content: ReactNode;
  /** Questions with answers shown on the page (service section), for FAQ structured data. */
  faq: { question: string; answer: string }[];
};

/**
 * The shop's products and categories, wherever they are maintained (today DatoCMS). Products are the active ones
 * (inactive products do not exist for the website). Reads are cached per request.
 */
export type Catalog = {
  /** Active products by id, to verify a cart at checkout. Unknown or inactive ids are left out. */
  getCheckoutProducts(ids: string[]): Promise<CheckoutProduct[]>;

  /** All products, sorted by name. */
  listProducts(): Promise<ProductSummary[]>;
  /** Featured products in their featured order (at most 8). */
  listFeaturedProducts(): Promise<ProductSummary[]>;
  /** A product by its slug, null if there is none. */
  getProduct(slug: string): Promise<ProductWithDescription | null>;
  /** Slugs of all products, to prerender their pages. */
  listProductSlugs(): Promise<string[]>;

  /** The categories shown in the shop (navigation, category tiles), sorted by name. */
  listCategories(): Promise<Category[]>;
  /** A category by its slug with its products, null if there is none. */
  getCategory(slug: string): Promise<CategoryWithProducts | null>;
  /** Slugs of all categories, to prerender their pages. */
  listCategorySlugs(): Promise<string[]>;

  /** The shop's start page, null if it is missing or has no sections. Shows drafts in draft mode. */
  getShopStartPage(): Promise<ShopStartPage | null>;

  /** Categories and products with their last change, for sitemap and robots.txt. */
  listSitemapEntries(): Promise<{ categories: CatalogSitemapEntry[]; products: CatalogSitemapEntry[] }>;
  /** All products with what a shopping feed needs (prices, variants, shipping, images, SEO texts, some technical data). */
  listFeedProducts(): Promise<Product[]>;
};
