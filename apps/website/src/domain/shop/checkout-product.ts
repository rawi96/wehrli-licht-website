/** A product as the checkout needs it to verify a cart: prices, variants and shipping. */
export type CheckoutProduct = {
  id: string;
  name: string;
  slug: string;
  /** Price in CHF without variants, or null. */
  price: number | null;
  /** e.g. "2–3 Wochen" */
  deliveryTime: string | null;
  /** Shipping cost per unit in CHF; null uses the shop's default. */
  shippingCost: number | null;
  imageUrl: string | null;
  variants: {
    price: number | null;
    selections: { option: string; value: string }[];
  }[];
};
