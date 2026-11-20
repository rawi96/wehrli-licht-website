import type { CategoryForSeo, ProductForSeo } from '@/utils/shop-seo/types';
import { stripHtml, truncateText } from '@/utils/text';
import { MAX_SEO_TITLE_LENGTH, SITE_BRAND } from '@/constants/site';

const plainTextFromStructured = (value: unknown): string => {
  if (!value || typeof value !== 'object') {
    return '';
  }

  const doc = 'document' in value && (value as { document?: unknown }).document ? value.document : value;

  const parts: string[] = [];

  const walk = (node: unknown): void => {
    if (!node || typeof node !== 'object') {
      return;
    }

    const n = node as { type?: string; value?: string; children?: unknown[] };
    if (n.type === 'span' && n.value) {
      parts.push(n.value);
    }
    for (const child of n.children ?? []) {
      walk(child);
    }
  };

  walk(doc);

  return parts.join(' ').replace(/\s+/g, ' ').trim();
};

export const primaryCategory = (product: ProductForSeo): ProductForSeo['categories'][number] | undefined =>
  product.categories.find((c) => c.slug !== 'wohnraumleuchte') ?? product.categories[0];

const productTechnicalSnippet = (product: ProductForSeo): string => {
  const parts: string[] = [];
  if (product.power) {
    parts.push(`Leistung ${product.power}`);
  }
  if (product.brightness) {
    parts.push(product.brightness);
  }
  if (product.lightColor) {
    parts.push(product.lightColor);
  }
  if (product.dimmable) {
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
  if (product.seoTitle?.trim()) {
    return withBrand(product.seoTitle.trim());
  }

  const category = primaryCategory(product);
  const categoryPart = category ? ` – ${category.name}` : '';

  return `${truncateText(`${product.name}${categoryPart}`, MAX_SEO_TITLE_LENGTH - BRAND_SUFFIX.length)}${BRAND_SUFFIX}`;
};

export const buildProductDescription = (product: ProductForSeo): string => {
  if (product.seoDescription?.trim()) {
    return truncateText(product.seoDescription.trim(), 160);
  }

  const prose = plainTextFromStructured(product.description?.value);
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
  if (category.seoTitle?.trim()) {
    return withBrand(category.seoTitle.trim());
  }

  return `${truncateText(`${category.name} online kaufen`, MAX_SEO_TITLE_LENGTH - BRAND_SUFFIX.length)}${BRAND_SUFFIX}`;
};

export const buildCategoryDescription = (category: CategoryForSeo): string => {
  if (category.seoDescription?.trim()) {
    return truncateText(category.seoDescription.trim(), 160);
  }

  const trimmedDescription = category.description?.trim();
  const plainDescription = trimmedDescription ? stripHtml(trimmedDescription) : '';
  const defaultDescription = `${category.name} entdecken bei Wehrli Licht: Pendel-, Decken-, Wand- und Tischleuchten. Lichtberatung in Goldach.`;
  const fallback = plainDescription.length ? plainDescription : defaultDescription;

  return truncateText(fallback, 160);
};

export const getProductOfferPrice = (product: ProductForSeo): number | null => {
  const variantPrices = product.variants.map((v) => v.price).filter((p): p is number => typeof p === 'number');
  if (variantPrices.length > 0) {
    return Math.min(...variantPrices);
  }

  return typeof product.price === 'number' ? product.price : null;
};
