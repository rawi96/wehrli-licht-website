import { DEFAULT_SHIPPING_COST_CHF } from '@/constants/shop-commerce';
import { CheckoutShippingMethod } from '@/types/checkout';
import { formatPriceToCHF } from '@/utils/price';

/** Per-product commerce fields from DatoCMS (checkout + product pages). */
export type ProductCommerceMeta = {
  productId: string;
  name: string;
  /** CHF – Dato field `shipping_cost` (per unit, summed per line). */
  shippingCostChf?: number | null;
  /** Dato field `delivery_time`, e.g. "2–3 Wochen". */
  deliveryTime?: string | null;
};

export function mapProductsToCommerceMeta(
  products: {
    id: string;
    name: string;
    shippingCost?: number | null;
    deliveryTime?: string | null;
  }[],
): ProductCommerceMeta[] {
  return products.map((product) => ({
    productId: product.id,
    name: product.name,
    shippingCostChf: product.shippingCost ?? null,
    deliveryTime: product.deliveryTime ?? null,
  }));
}

/** Resolves per-unit shipping for one product (Dato value or shop default). */
export function resolveProductShippingCostChf(entry: ProductCommerceMeta | undefined): number {
  const cost = entry?.shippingCostChf;

  if (typeof cost === 'number' && !Number.isNaN(cost) && cost >= 0) {
    return cost;
  }

  return DEFAULT_SHIPPING_COST_CHF;
}

/**
 * Resolves total shipping for the cart. Pickup is always free.
 * Post: sum of (per-unit shipping × quantity) per line, using Dato `shipping_cost` or default.
 */
export function resolveCartShippingCostChf(
  shipping: CheckoutShippingMethod,
  lineItems: { productId: string; quantity: number }[],
  productCommerce: ProductCommerceMeta[] = [],
): number {
  if (shipping === 'pickup') {
    return 0;
  }

  const byId = new Map(productCommerce.map((entry) => [entry.productId, entry]));

  return lineItems.reduce((total, line) => {
    const unitCost = resolveProductShippingCostChf(byId.get(line.productId));

    return total + unitCost * line.quantity;
  }, 0);
}

export function formatShippingCostLabel(shipping: CheckoutShippingMethod, shippingCostChf: number): string {
  if (shipping === 'pickup') {
    return 'Gratis';
  }

  if (shippingCostChf <= 0) {
    return 'Gratis';
  }

  return formatPriceToCHF(shippingCostChf);
}

/** Label for confirmed order totals (review, success, emails). */
export function formatOrderShippingCostLabel(shipping: CheckoutShippingMethod, shippingCostChf: number): string {
  return formatShippingCostLabel(shipping, shippingCostChf);
}

/** Short summary for checkout sidebar, shipping step, review, emails. */
export function summarizeDeliveryTimes(
  lineItems: { productId: string }[],
  productCommerce: ProductCommerceMeta[],
): string | null {
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
}
