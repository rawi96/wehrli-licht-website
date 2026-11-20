import type { CatalogImage } from '@/domain/shop/image';
import type { ProductTechnicalData } from '@/domain/shop/technical-fields';

/** Search engine settings maintained for a product or category; empty texts fall back to generated ones. */
export type CatalogSeo = {
  title: string | null;
  description: string | null;
  noIndex: boolean;
};

/** One choice of a variant, e.g. option "Farbe" with value "Weiss". */
export type VariantSelection = {
  option: string;
  value: string;
};

/** A purchasable variant of a product (e.g. a colour and size), with its own price. */
export type ProductVariant = {
  price: number | null;
  selections: VariantSelection[];
};

/** The category a product belongs to, as far as the product needs it (SEO, feeds). */
export type ProductCategory = {
  id: string;
  name: string;
  slug: string;
};

/** Prices of a product: its own and its variants'. Variants win where they have one. */
export type ProductPrices = {
  /** Price in CHF without variants, or null. */
  price: number | null;
  variants: { price: number | null }[];
};

/** A product in lists (catalog, featured products, cards). */
export type ProductSummary = ProductPrices & {
  id: string;
  name: string;
  slug: string;
  /** Shown first in the «Empfohlen» order, by `featuredSort`. */
  featured: boolean;
  featuredSort: number | null;
  /** The first product image. */
  image: CatalogImage | null;
};

/**
 * A product with everything the product page, SEO and feeds need.
 *
 * The description is rich text in the catalog. The domain keeps it as plain text (`description`, for SEO texts and
 * feeds); the rendered rich text is presentation and comes from the catalog port next to the product
 * (`Catalog.getProduct`), rendered by the integration.
 */
export type Product = ProductPrices & {
  id: string;
  name: string;
  slug: string;
  variants: ProductVariant[];
  images: CatalogImage[];
  /** Plain text of the description, empty if there is none. */
  description: string;
  /** e.g. "2–3 Wochen" */
  deliveryTime: string | null;
  /** Shipping cost per unit in CHF; null uses the shop's default. */
  shippingCost: number | null;
  categories: ProductCategory[];
  seo: CatalogSeo;
  /** Technical data; a listing that does not need all of it (e.g. the feed) may leave fields out. */
  technical: ProductTechnicalData;
};
