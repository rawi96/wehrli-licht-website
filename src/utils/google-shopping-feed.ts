import { DEFAULT_SHIPPING_COST_CHF } from '@/constants/shop-commerce';
import { GoogleShoppingFeedProductsDocument, ShopGoogleShoppingProductFragment } from '@/graphql/generated';
import { buildProductDescription, buildProductTitle } from '@/utils/shop-seo';
import { getSiteUrl } from '@/utils/site-url';
import { queryDatoCMS } from '@/utils/query-dato-cms';

/** Google taxonomy: Home & Garden > Lighting */
const GOOGLE_PRODUCT_CATEGORY = '594';

const BRAND = 'Wehrli Licht';
const MAX_TITLE = 150;
const MAX_DESCRIPTION = 5000;

export type GoogleShoppingFeedItem = {
  id: string;
  itemGroupId?: string;
  title: string;
  description: string;
  link: string;
  imageLink: string;
  priceChf: number;
  shippingCostChf: number;
  productType?: string;
  mpn: string;
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function truncate(text: string, max: number): string {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length <= max) {
    return normalized;
  }

  return `${normalized.slice(0, max - 1).trimEnd()}…`;
}

function slugifyToken(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

function formatPriceChf(amount: number): string {
  return `${amount.toFixed(2)} CHF`;
}

function primaryCategoryName(product: ShopGoogleShoppingProductFragment): string | undefined {
  const category = product.categories.find((c) => c.slug !== 'wohnraumleuchte') ?? product.categories[0];

  return category?.name;
}

function productImageUrl(product: ShopGoogleShoppingProductFragment): string | null {
  const image = product.images[0];
  if (!image) {
    return null;
  }

  return image.responsiveImage?.src ?? image.url;
}

function variantLabel(selections: ShopGoogleShoppingProductFragment['variants'][number]['selections']): string {
  return selections
    .map((s) => s.value)
    .filter(Boolean)
    .join(', ');
}

function buildVariantId(
  productSlug: string,
  selections: ShopGoogleShoppingProductFragment['variants'][number]['selections'],
): string {
  if (selections.length === 0) {
    return productSlug;
  }

  const suffix = selections
    .map((s) => `${slugifyToken(s.option)}-${slugifyToken(s.value)}`)
    .filter(Boolean)
    .join('--');

  return suffix ? `${productSlug}--${suffix}` : productSlug;
}

function buildShoppingTitle(
  product: ShopGoogleShoppingProductFragment,
  variantSelections?: ShopGoogleShoppingProductFragment['variants'][number]['selections'],
): string {
  const base = buildProductTitle(product);
  if (!variantSelections?.length) {
    return truncate(base, MAX_TITLE);
  }

  const variantPart = variantLabel(variantSelections);

  return truncate(`${product.name} – ${variantPart}`, MAX_TITLE);
}

function buildShoppingDescription(product: ShopGoogleShoppingProductFragment): string {
  return truncate(buildProductDescription(product), MAX_DESCRIPTION);
}

function resolvePrice(
  product: ShopGoogleShoppingProductFragment,
  variant?: ShopGoogleShoppingProductFragment['variants'][number],
): number | null {
  if (typeof variant?.price === 'number') {
    return variant.price;
  }
  if (typeof product.price === 'number') {
    return product.price;
  }

  return null;
}

export function productToFeedItems(product: ShopGoogleShoppingProductFragment, siteUrl: string): GoogleShoppingFeedItem[] {
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
}

export async function getAllGoogleShoppingFeedItems(): Promise<GoogleShoppingFeedItem[]> {
  const siteUrl = getSiteUrl();
  const pageSize = 100;
  const items: GoogleShoppingFeedItem[] = [];

  const firstPage = await queryDatoCMS({
    document: GoogleShoppingFeedProductsDocument,
    variables: { skip: 0 },
  });

  const total = firstPage.meta.count;

  const collect = (products: ShopGoogleShoppingProductFragment[]) => {
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
}

export function buildGoogleShoppingFeedXml(items: GoogleShoppingFeedItem[]): string {
  const siteUrl = getSiteUrl();
  const channelTitle = escapeXml('Wehrli Licht – Shop');
  const channelDescription = escapeXml('Leuchten und Lampen von Wehrli Licht GmbH, Goldach (Schweiz).');

  const itemXml = items
    .map((item) => {
      const shippingXml = `
      <g:shipping>
        <g:country>CH</g:country>
        <g:service>Standard</g:service>
        <g:price>${escapeXml(formatPriceChf(item.shippingCostChf))}</g:price>
      </g:shipping>`;

      const itemGroupXml = item.itemGroupId
        ? `\n      <g:item_group_id>${escapeXml(item.itemGroupId)}</g:item_group_id>`
        : '';

      const productTypeXml = item.productType
        ? `\n      <g:product_type>${escapeXml(item.productType)}</g:product_type>`
        : '';

      return `
    <item>
      <g:id>${escapeXml(item.id)}</g:id>${itemGroupXml}
      <g:title>${escapeXml(item.title)}</g:title>
      <g:description>${escapeXml(item.description)}</g:description>
      <g:link>${escapeXml(item.link)}</g:link>
      <g:image_link>${escapeXml(item.imageLink)}</g:image_link>
      <g:availability>in_stock</g:availability>
      <g:price>${escapeXml(formatPriceChf(item.priceChf))}</g:price>
      <g:brand>${escapeXml(BRAND)}</g:brand>
      <g:condition>new</g:condition>
      <g:identifier_exists>false</g:identifier_exists>
      <g:mpn>${escapeXml(item.mpn)}</g:mpn>
      <g:google_product_category>${GOOGLE_PRODUCT_CATEGORY}</g:google_product_category>${productTypeXml}${shippingXml}
    </item>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${channelTitle}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${channelDescription}</description>${itemXml}
  </channel>
</rss>`;
}
