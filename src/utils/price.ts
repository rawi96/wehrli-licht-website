type ProductPrice = {
  price?: number | null;
  variants: { price: number | null }[];
};

export const formatPriceToCHF = (price?: number) => {
  if (!price) {
    return '';
  }

  return price.toLocaleString('de-CH', {
    style: 'currency',
    currency: 'CHF',
  });
};

export const getProductMinPriceChf = (product: ProductPrice): number | null => {
  const variantPrices = product.variants
    .map((variant) => variant.price)
    .filter((price): price is number => typeof price === 'number' && price > 0);

  if (variantPrices.length > 0) {
    return Math.min(...variantPrices);
  }

  const basePrice = product.price;

  return typeof basePrice === 'number' && basePrice > 0 ? basePrice : null;
};

export const getLowestPriceFromProduct = (product: ProductPrice) => {
  const variantPrices = product.variants
    .map((variant) => variant.price)
    .filter((price): price is number => typeof price === 'number');

  if (variantPrices.length > 0) {
    return `Ab ${formatPriceToCHF(Math.min(...variantPrices))}`;
  }

  return formatPriceToCHF(product.price ?? undefined);
};
