import { Cart, emptyCart, withComputedTotals } from '@/domain/shop/cart';

// The cart is kept in the browser's localStorage, so it survives reloads and visits.

const STORAGE_KEY = 'wehrli-shop-cart';

export const loadCartFromStorage = (): Cart => {
  if (typeof window === 'undefined') {
    return emptyCart();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return emptyCart();
    }

    const parsed = JSON.parse(raw) as Cart;

    if (!Array.isArray(parsed.items)) {
      return emptyCart();
    }

    return withComputedTotals(parsed.items);
  } catch {
    return emptyCart();
  }
};

export const saveCartToStorage = (cart: Cart): void => {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
};
