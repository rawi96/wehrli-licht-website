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

export const getLowestPriceFromProduct = (product: ProductPrice) => {
  const variantPrices = product.variants
    .map((variant) => variant.price)
    .filter((price): price is number => typeof price === 'number');

  if (variantPrices.length > 0) {
    return `Ab ${formatPriceToCHF(Math.min(...variantPrices))}`;
  }

  return formatPriceToCHF(product.price ?? undefined);
};
