import { formatPriceToCHF } from '@/domain/shop/price';

/** Default CHF shipping per product unit when a product has no shipping cost (matches the CMS field default). */
export const DEFAULT_SHIPPING_COST_CHF = 15;

/** Most units of one product (line) in the cart; the checkout API rejects more. */
export const MAX_LINE_QUANTITY = 10;

/** How an order reaches the customer: by post or picked up in the shop (free). */
export type ShippingMethod = 'pickup' | 'post';

/** Shipping cost per unit of a product: its own, else the shop's default. */
export const getProductShippingCostChf = (product: { shippingCost: number | null }): number =>
  typeof product.shippingCost === 'number' ? product.shippingCost : DEFAULT_SHIPPING_COST_CHF;

export type ProductCommerceMeta = {
  productId: string;
  name: string;
  shippingCostChf?: number | null;
  deliveryTime?: string | null;
};

type ProductCommerceSource = {
  id: string;
  name: string;
  shippingCost?: number | null;
  deliveryTime?: string | null;
};

export const mapProductsToCommerceMeta = (products: ProductCommerceSource[]): ProductCommerceMeta[] =>
  products.map((product) => ({
    productId: product.id,
    name: product.name,
    shippingCostChf: product.shippingCost ?? null,
    deliveryTime: product.deliveryTime ?? null,
  }));

export const resolveProductShippingCostChf = (entry: ProductCommerceMeta | undefined): number => {
  const cost = entry?.shippingCostChf;

  if (typeof cost === 'number' && !Number.isNaN(cost) && cost >= 0) {
    return cost;
  }

  return DEFAULT_SHIPPING_COST_CHF;
};

export const resolveCartShippingCostChf = (
  shipping: ShippingMethod,
  lineItems: { productId: string; quantity: number }[],
  productCommerce: ProductCommerceMeta[] = [],
): number => {
  if (shipping === 'pickup') {
    return 0;
  }

  const byId = new Map(productCommerce.map((entry) => [entry.productId, entry]));

  return lineItems.reduce((total, line) => {
    const unitCost = resolveProductShippingCostChf(byId.get(line.productId));

    return total + unitCost * line.quantity;
  }, 0);
};

export const formatShippingCostLabel = (shipping: ShippingMethod, shippingCostChf: number): string => {
  if (shipping === 'pickup' || shippingCostChf <= 0) {
    return 'Gratis';
  }

  return formatPriceToCHF(shippingCostChf);
};

export const summarizeDeliveryTimes = (
  lineItems: { productId: string }[],
  productCommerce: ProductCommerceMeta[],
): string | null => {
  const byId = new Map(productCommerce.map((entry) => [entry.productId, entry]));
  const unique = [
    ...new Set(
      lineItems
        .map((line) => byId.get(line.productId)?.deliveryTime?.trim())
        .filter((value): value is string => Boolean(value)),
    ),
  ];

  if (unique.length === 0) {
    return null;
  }

  if (unique.length === 1) {
    return unique[0];
  }

  return 'Je nach Produkt unterschiedlich';
};
