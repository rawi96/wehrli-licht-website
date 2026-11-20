import type { ProductPrices } from '@/domain/shop/product';

/**
 * "CHF 1’370.00": Swiss format with a typographic apostrophe as thousands separator. Formatted by hand, not with
 * `toLocaleString('de-CH')`: Node and browsers ship different locale data (Node uses ' and Chrome ’), so prices from
 * 1000 would differ between server and client and break hydration.
 */
export const formatPriceToCHF = (price?: number) => {
  if (!price) {
    return '';
  }

  const [francs, rappen] = Math.abs(price).toFixed(2).split('.');
  const grouped = francs.replace(/\B(?=(\d{3})+(?!\d))/g, '\u2019');

  return `CHF\u00a0${price < 0 ? '-' : ''}${grouped}.${rappen}`;
};

/** Lowest positive price of a product (its variants' if it has any), or null. */
export const getProductMinPriceChf = (product: ProductPrices): number | null => {
  const variantPrices = product.variants
    .map((variant) => variant.price)
    .filter((price): price is number => typeof price === 'number' && price > 0);

  if (variantPrices.length > 0) {
    return Math.min(...variantPrices);
  }

  const basePrice = product.price;

  return typeof basePrice === 'number' && basePrice > 0 ? basePrice : null;
};

/** Price label of a product in lists: "Ab CHF …" with variants, else its price. */
export const getLowestPriceFromProduct = (product: ProductPrices) => {
  const variantPrices = product.variants
    .map((variant) => variant.price)
    .filter((price): price is number => typeof price === 'number');

  if (variantPrices.length > 0) {
    return `Ab ${formatPriceToCHF(Math.min(...variantPrices))}`;
  }

  return formatPriceToCHF(product.price ?? undefined);
};
