import { ProductCommerceMeta, resolveCartShippingCostChf } from '@/utils/product-commerce';
import type { CheckoutShippingMethod } from './order';

export type CheckoutTotals = {
  subTotalChf: number;
  shippingCostChf: number;
  grandTotalChf: number;
};

/** The cart as verified by the server for the review step: catalog names and prices, totals, delivery time. */
export type VerifiedCheckoutQuote = {
  lines: {
    productId: string;
    name: string;
    quantity: number;
    unitPriceChf: number;
  }[];
  totals: CheckoutTotals;
  deliveryTimeSummary?: string;
};

export const computeCheckoutTotals = (
  items: { productId: string; quantity: number; unitPriceChf: number }[],
  shipping: CheckoutShippingMethod,
  productCommerce: ProductCommerceMeta[] = [],
): CheckoutTotals => {
  const subTotalChf = items.reduce((sum, item) => sum + item.unitPriceChf * item.quantity, 0);
  const shippingCostChf = resolveCartShippingCostChf(shipping, items, productCommerce);

  return {
    subTotalChf,
    shippingCostChf,
    grandTotalChf: subTotalChf + shippingCostChf,
  };
};
