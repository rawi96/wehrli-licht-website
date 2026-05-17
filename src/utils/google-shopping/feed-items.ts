import { DEFAULT_SHIPPING_COST_CHF } from '@/constants/shop-commerce';
import { GoogleShoppingFeedProductsDocument, ShopGoogleShoppingProductFragment } from '@/graphql/generated';
import type { GoogleShoppingFeedItem } from '@/utils/google-shopping/types';
import { buildProductDescription, buildProductTitle } from '@/utils/shop-seo';
import { getSiteUrl } from '@/utils/site-url';
import { queryDatoCMS } from '@/utils/query-dato-cms';
import { slugifyToken, truncateText } from '@/utils/text';

const MAX_TITLE = 150;
const MAX_DESCRIPTION = 5000;

const primaryCategoryName = (product: ShopGoogleShoppingProductFragment): string | undefined => {
  const category = product.categories.find((c) => c.slug !== 'wohnraumleuchte') ?? product.categories[0];

  return category?.name;
};

const productImageUrl = (product: ShopGoogleShoppingProductFragment): string | null => {
  const image = product.images[0];
  if (!image) {
    return null;
  }

  return image.responsiveImage?.src ?? image.url;
};

const variantLabel = (selections: ShopGoogleShoppingProductFragment['variants'][number]['selections']): string =>
  selections
    .map((s) => s.value)
    .filter(Boolean)
    .join(', ');

const buildVariantId = (
  productSlug: string,
  selections: ShopGoogleShoppingProductFragment['variants'][number]['selections'],
): string => {
  if (selections.length === 0) {
    return productSlug;
  }

  const suffix = selections
    .map((s) => `${slugifyToken(s.option)}-${slugifyToken(s.value)}`)
    .filter(Boolean)
    .join('--');

  return suffix ? `${productSlug}--${suffix}` : productSlug;
};

const buildShoppingTitle = (
  product: ShopGoogleShoppingProductFragment,
  variantSelections?: ShopGoogleShoppingProductFragment['variants'][number]['selections'],
): string => {
  const base = buildProductTitle(product);
  if (!variantSelections?.length) {
    return truncateText(base, MAX_TITLE);
  }

  return truncateText(`${product.name} – ${variantLabel(variantSelections)}`, MAX_TITLE);
};

const buildShoppingDescription = (product: ShopGoogleShoppingProductFragment): string =>
  truncateText(buildProductDescription(product), MAX_DESCRIPTION);

const resolvePrice = (
  product: ShopGoogleShoppingProductFragment,
  variant?: ShopGoogleShoppingProductFragment['variants'][number],
): number | null => {
  if (typeof variant?.price === 'number') {
    return variant.price;
  }
  if (typeof product.price === 'number') {
    return product.price;
  }

  return null;
};

export const productToFeedItems = (
  product: ShopGoogleShoppingProductFragment,
  siteUrl: string,
): GoogleShoppingFeedItem[] => {
  if (product.seoNoindex) {
    return [];
  }

  const imageLink = productImageUrl(product);
  if (!imageLink) {
    return [];
  }

  const link = `${siteUrl}/shop/produkte/${product.slug}`;
  const description = buildShoppingDescription(product);
  const shippingCostChf = typeof product.shippingCost === 'number' ? product.shippingCost : DEFAULT_SHIPPING_COST_CHF;
  const productType = primaryCategoryName(product);

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

export const getAllGoogleShoppingFeedItems = async (): Promise<GoogleShoppingFeedItem[]> => {
  const siteUrl = getSiteUrl();
  const pageSize = 100;
  const items: GoogleShoppingFeedItem[] = [];

  const firstPage = await queryDatoCMS({
    document: GoogleShoppingFeedProductsDocument,
    variables: { skip: 0 },
  });

  const total = firstPage.meta.count;

  const collect = (products: ShopGoogleShoppingProductFragment[]): void => {
    for (const product of products) {
      items.push(...productToFeedItems(product, siteUrl));
    }
  };

  collect(firstPage.allShopProducts);

  for (let skip = pageSize; skip < total; skip += pageSize) {
    const page = await queryDatoCMS({
      document: GoogleShoppingFeedProductsDocument,
      variables: { skip },
    });
    collect(page.allShopProducts);
  }

  return items;
};
