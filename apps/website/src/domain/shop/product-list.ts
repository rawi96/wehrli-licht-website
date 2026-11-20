import { getProductMinPriceChf } from '@/domain/shop/price';
import type { ProductSummary } from '@/domain/shop/product';

// Search and order of a product list (the shop's catalog).

export type ShopProductSortKey = 'featured' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';

export const SHOP_PRODUCT_SORT_OPTIONS: { value: ShopProductSortKey; label: string }[] = [
  { value: 'featured', label: 'Empfohlen' },
  { value: 'name-asc', label: 'Name A–Z' },
  { value: 'name-desc', label: 'Name Z–A' },
  { value: 'price-asc', label: 'Preis aufsteigend' },
  { value: 'price-desc', label: 'Preis absteigend' },
];

const locale = 'de-CH';

const normalizeQuery = (query: string): string => query.trim().toLocaleLowerCase(locale);

const compareNames = (a: ProductSummary, b: ProductSummary): number =>
  a.name.localeCompare(b.name, locale, { sensitivity: 'base' });

const comparePrices = (a: ProductSummary, b: ProductSummary): number => {
  const priceA = getProductMinPriceChf(a);
  const priceB = getProductMinPriceChf(b);

  if (priceA === null && priceB === null) {
    return compareNames(a, b);
  }
  if (priceA === null) {
    return 1;
  }
  if (priceB === null) {
    return -1;
  }

  return priceA - priceB;
};

const filterByQuery = (products: ProductSummary[], query: string): ProductSummary[] => {
  const normalized = normalizeQuery(query);
  if (!normalized) {
    return products;
  }

  return products.filter((product) => product.name.toLocaleLowerCase(locale).includes(normalized));
};

const sortByKey = (products: ProductSummary[], sortKey: ShopProductSortKey): ProductSummary[] => {
  const sorted = [...products];

  switch (sortKey) {
    case 'name-asc':
      return sorted.sort(compareNames);
    case 'name-desc':
      return sorted.sort((a, b) => compareNames(b, a));
    case 'price-asc':
      return sorted.sort(comparePrices);
    case 'price-desc':
      return sorted.sort((a, b) => comparePrices(b, a));
    case 'featured':
    default:
      return sorted.sort((a, b) => {
        if (a.featured !== b.featured) {
          return a.featured ? -1 : 1;
        }

        const sortA = a.featuredSort ?? Number.MAX_SAFE_INTEGER;
        const sortB = b.featuredSort ?? Number.MAX_SAFE_INTEGER;
        if (sortA !== sortB) {
          return sortA - sortB;
        }

        return compareNames(a, b);
      });
  }
};

export const getVisibleShopProducts = (
  products: ProductSummary[],
  query: string,
  sortKey: ShopProductSortKey,
): ProductSummary[] => sortByKey(filterByQuery(products, query), sortKey);
