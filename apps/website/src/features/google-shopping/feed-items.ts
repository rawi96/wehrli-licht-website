import { getProductShippingCostChf } from '@/domain/shop/commerce';
import { imageUrl } from '@/domain/shop/image';
import type { Product, ProductVariant, VariantSelection } from '@/domain/shop/product';
import { buildProductDescription, buildProductTitle, primaryCategory } from '@/domain/shop/seo';
import type { GoogleShoppingFeedItem } from './types';
import { slugifyToken, truncateText } from '@/lib/text';

const MAX_TITLE = 150;
const MAX_DESCRIPTION = 5000;

const variantLabel = (selections: VariantSelection[]): string =>
  selections
    .map((s) => s.value)
    .filter(Boolean)
    .join(', ');

const buildVariantId = (productSlug: string, selections: VariantSelection[]): string => {
  if (selections.length === 0) {
    return productSlug;
  }

  const suffix = selections
    .map((s) => `${slugifyToken(s.option)}-${slugifyToken(s.value)}`)
    .filter(Boolean)
    .join('--');

  return suffix ? `${productSlug}--${suffix}` : productSlug;
};

const buildShoppingTitle = (product: Product, variantSelections?: VariantSelection[]): string => {
  const base = buildProductTitle(product);
  if (!variantSelections?.length) {
    return truncateText(base, MAX_TITLE);
  }

  return truncateText(`${product.name} – ${variantLabel(variantSelections)}`, MAX_TITLE);
};

const buildShoppingDescription = (product: Product): string =>
  truncateText(buildProductDescription(product), MAX_DESCRIPTION);

const resolvePrice = (product: Product, variant?: ProductVariant): number | null => {
  if (typeof variant?.price === 'number') {
    return variant.price;
  }
  if (typeof product.price === 'number') {
    return product.price;
  }

  return null;
};

/** A product's items of the Google Shopping feed: one per variant with a price, none if it is noindex or has no image. */
export const productToFeedItems = (product: Product, siteUrl: string): GoogleShoppingFeedItem[] => {
  if (product.seo.noIndex) {
    return [];
  }

  const imageLink = imageUrl(product.images[0]);
  if (!imageLink) {
    return [];
  }

  const link = `${siteUrl}/shop/produkte/${product.slug}`;
  const description = buildShoppingDescription(product);
  const shippingCostChf = getProductShippingCostChf(product);
  const productType = primaryCategory(product)?.name;

  if (product.variants.length === 0) {
    const priceChf = resolvePrice(product);
    if (typeof priceChf !== 'number') {
      return [];
    }

    return [
      {
        id: product.slug,
        title: buildShoppingTitle(product),
        description,
        link,
        imageLink,
        priceChf,
        shippingCostChf,
        productType,
        mpn: product.slug,
      },
    ];
  }

  const variantItems: GoogleShoppingFeedItem[] = [];

  for (const variant of product.variants) {
    const priceChf = resolvePrice(product, variant);
    if (typeof priceChf !== 'number') {
      continue;
    }

    const id = buildVariantId(product.slug, variant.selections);

    variantItems.push({
      id,
      itemGroupId: product.slug,
      title: buildShoppingTitle(product, variant.selections),
      description,
      link,
      imageLink,
      priceChf,
      shippingCostChf,
      productType,
      mpn: id,
    });
  }

  return variantItems;
};
