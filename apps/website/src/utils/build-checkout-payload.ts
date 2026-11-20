import { CheckoutCartItemPayload } from '@/utils/cart-checkout';
import { Cart } from '@/utils/cart';

export const buildCheckoutItemsFromCart = (cart: Cart): CheckoutCartItemPayload[] =>
  cart.items.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
    selections: item.selections,
  }));

export const cartCheckoutFingerprint = (cart: Cart): string =>
  JSON.stringify(
    cart.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      selections: item.selections ?? [],
    })),
  );
