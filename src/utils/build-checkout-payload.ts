import { CheckoutCartItemPayload } from '@/utils/cart-checkout';
import { Cart } from '@/utils/cart';

/** Reads the current cart snapshot for checkout (call at submit time, not earlier). */
export function buildCheckoutItemsFromCart(cart: Cart): CheckoutCartItemPayload[] {
  return cart.items.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
    selections: item.selections,
  }));
}

export function cartCheckoutFingerprint(cart: Cart): string {
  return JSON.stringify(
    cart.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      selections: item.selections ?? [],
    })),
  );
}
