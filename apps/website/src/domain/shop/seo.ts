import { MAX_SEO_TITLE_LENGTH, SITE_BRAND } from '@/constants/site';
import type { Category } from '@/domain/shop/category';
import type { Product } from '@/domain/shop/product';
import { stripHtml, truncateText } from '@/utils/text';

// Titles and descriptions of shop pages for search engines and feeds.

/** What SEO texts need of a product (the product page and the feed provide it). */
export type ProductForSeo = Pick<
  Product,
  'name' | 'slug' | 'seo' | 'description' | 'categories' | 'price' | 'variants' | 'deliveryTime' | 'technical'
>;

export type CategoryForSeo = Pick<Category, 'name' | 'slug' | 'seo' | 'descriptionHtml'>;

/** The category a product is filed under for SEO: the first one that is not the catch-all «Wohnraumleuchte». */
export const primaryCategory = (product: Pick<Product, 'categories'>): Product['categories'][number] | undefined =>
  product.categories.find((c) => c.slug !== 'wohnraumleuchte') ?? product.categories[0];

const productTechnicalSnippet = (product: ProductForSeo): string => {
  const parts: string[] = [];
  const { power, brightness, lightColor, dimmable } = product.technical;
  if (power) {
    parts.push(`Leistung ${power}`);
  }
  if (brightness) {
    parts.push(brightness);
  }
  if (lightColor) {
    parts.push(lightColor);
  }
  if (dimmable) {
    parts.push('dimmbar');
  }
  if (product.deliveryTime) {
    parts.push(`Lieferzeit ${product.deliveryTime}`);
  }

  return parts.join(', ');
};

/** Brand appended to shop titles. */
const BRAND_SUFFIX = ` | ${SITE_BRAND}`;

/** Appends the brand to CMS titles that do not mention it yet, if it still fits. */
const withBrand = (title: string): string =>
  title.includes(SITE_BRAND) || title.length + BRAND_SUFFIX.length > MAX_SEO_TITLE_LENGTH
    ? title
    : `${title}${BRAND_SUFFIX}`;

export const buildProductTitle = (product: ProductForSeo): string => {
  if (product.seo.title?.trim()) {
    return withBrand(product.seo.title.trim());
  }

  const category = primaryCategory(product);
  const categoryPart = category ? ` – ${category.name}` : '';

  return `${truncateText(`${product.name}${categoryPart}`, MAX_SEO_TITLE_LENGTH - BRAND_SUFFIX.length)}${BRAND_SUFFIX}`;
};

export const buildProductDescription = (product: ProductForSeo): string => {
  if (product.seo.description?.trim()) {
    return truncateText(product.seo.description.trim(), 160);
  }

  const prose = product.description;
  const tech = productTechnicalSnippet(product);
  let description = prose;

  if (tech && description.length < 120) {
    description = description ? `${description} ${tech}` : tech;
  }

  if (!description) {
    description = `${product.name} – hochwertige Leuchte bei Wehrli Licht in Goldach. Beratung, Planung und Lieferung in der Schweiz.`;
  }

  return truncateText(description, 160);
};

export const buildCategoryTitle = (category: CategoryForSeo): string => {
  if (category.seo.title?.trim()) {
    return withBrand(category.seo.title.trim());
  }

  return `${truncateText(`${category.name} online kaufen`, MAX_SEO_TITLE_LENGTH - BRAND_SUFFIX.length)}${BRAND_SUFFIX}`;
};

export const buildCategoryDescription = (category: CategoryForSeo): string => {
  if (category.seo.description?.trim()) {
    return truncateText(category.seo.description.trim(), 160);
  }

  const trimmedDescription = category.descriptionHtml?.trim();
  const plainDescription = trimmedDescription ? stripHtml(trimmedDescription) : '';
  const defaultDescription = `${category.name} entdecken bei Wehrli Licht: Pendel-, Decken-, Wand- und Tischleuchten. Lichtberatung in Goldach.`;
  const fallback = plainDescription.length ? plainDescription : defaultDescription;

  return truncateText(fallback, 160);
};

/** Price of the product's offer (structured data): the lowest variant price, else its price. */
export const getProductOfferPrice = (product: Pick<Product, 'price' | 'variants'>): number | null => {
  const variantPrices = product.variants.map((v) => v.price).filter((p): p is number => typeof p === 'number');
  if (variantPrices.length > 0) {
    return Math.min(...variantPrices);
  }

  return typeof product.price === 'number' ? product.price : null;
};
