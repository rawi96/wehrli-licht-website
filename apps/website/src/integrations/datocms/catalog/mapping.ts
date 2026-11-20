import type { Category } from '@/domain/shop/category';
import type { CatalogImage, ResponsiveImage } from '@/domain/shop/image';
import type { Product, ProductSummary } from '@/domain/shop/product';
import { PRODUCT_TECHNICAL_FIELDS, ProductTechnicalData } from '@/domain/shop/technical-fields';
import type {
  ShopCategoryFragment,
  ShopGoogleShoppingProductFragment,
  ShopProductDetailFragment,
  ShopProductListItemFragment,
} from '@/graphql/generated';
import { structuredTextToPlainText } from './structured-text';

// DatoCMS records of the shop mapped onto the domain types.

type DatoFile = {
  url: string;
  alt: string | null;
  title: string | null;
  responsiveImage: ResponsiveImage | null;
};

const toCatalogImage = (file: DatoFile): CatalogImage => ({
  url: file.url,
  alt: file.alt,
  title: file.title,
  responsive: file.responsiveImage,
});

export const toCategory = (record: ShopCategoryFragment): Category => ({
  id: record.id,
  name: record.name,
  slug: record.slug,
  descriptionHtml: record.description,
  image: record.image ? toCatalogImage(record.image) : null,
  seo: { title: record.seoTitle, description: record.seoDescription, noIndex: record.seoNoindex },
});

export const toProductSummary = (record: ShopProductListItemFragment): ProductSummary => ({
  id: record.id,
  name: record.name,
  slug: record.slug,
  featured: record.featured,
  featuredSort: record.featuredSort,
  price: record.price,
  variants: record.variants.map(({ price }) => ({ price })),
  image: record.images[0] ? toCatalogImage(record.images[0]) : null,
});

/** The technical fields the record has (the feed's query asks for a few only). */
const toTechnicalData = (record: Partial<Record<keyof ProductTechnicalData, unknown>>): ProductTechnicalData =>
  Object.fromEntries(PRODUCT_TECHNICAL_FIELDS.filter(({ key }) => key in record).map(({ key }) => [key, record[key]]));

export const toProduct = (record: ShopProductDetailFragment | ShopGoogleShoppingProductFragment): Product => ({
  id: record.id,
  name: record.name,
  slug: record.slug,
  price: record.price,
  variants: record.variants.map((variant) => ({
    price: variant.price,
    selections: variant.selections.map(({ option, value }) => ({ option, value })),
  })),
  images: record.images.map(toCatalogImage),
  description: structuredTextToPlainText(record.description?.value),
  deliveryTime: record.deliveryTime,
  shippingCost: record.shippingCost,
  categories: record.categories.map(({ id, name, slug }) => ({ id, name, slug })),
  seo: { title: record.seoTitle, description: record.seoDescription, noIndex: record.seoNoindex },
  technical: toTechnicalData(record),
});
