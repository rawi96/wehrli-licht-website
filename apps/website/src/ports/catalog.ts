import type { CheckoutProduct } from '@/domain/shop/checkout-product';

/** The shop's products and categories, wherever they are maintained (today DatoCMS). */
export type Catalog = {
  /** Active products by id, to verify a cart at checkout. Unknown or inactive ids are left out. */
  getCheckoutProducts(ids: string[]): Promise<CheckoutProduct[]>;
};
