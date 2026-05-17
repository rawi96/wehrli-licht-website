import { ShopProduct } from '@/utils/shop';

export type CartSelection = {
  option: string;
  value: string;
};

export type CartItem = {
  id: string;
  productId: string;
  productSlug: string;
  productName: string;
  imageUrl?: string;
  price: number;
  quantity: number;
  selections?: CartSelection[];
};

export type Cart = {
  items: CartItem[];
  item_quantity: number;
  sub_total: number;
  shipment_price: number;
  grand_total: number;
};

const STORAGE_KEY = 'wehrli-shop-cart';
const LEGACY_STORAGE_KEY = 'wehrli-dato-cart';

export const emptyCart = (): Cart => ({
  items: [],
  item_quantity: 0,
  sub_total: 0,
  shipment_price: 0,
  grand_total: 0,
});

export function getVariantKey(selections: CartSelection[]): string {
  if (selections.length === 0) {
    return '';
  }

  return [...selections]
    .sort((a, b) => a.option.localeCompare(b.option))
    .map((selection) => `${selection.option}:${selection.value}`)
    .join('|');
}

export function createLineItemId(productId: string, variantKey: string): string {
  return variantKey ? `${productId}::${variantKey}` : productId;
}

function computeTotals(items: CartItem[]): Pick<Cart, 'item_quantity' | 'sub_total' | 'shipment_price' | 'grand_total'> {
  const item_quantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const sub_total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipment_price = 0;

  return {
    item_quantity,
    sub_total,
    shipment_price,
    grand_total: sub_total + shipment_price,
  };
}

export function withComputedTotals(items: CartItem[]): Cart {
  return {
    items,
    ...computeTotals(items),
  };
}

export function loadCartFromStorage(): Cart {
  if (typeof window === 'undefined') {
    return emptyCart();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) {
      return emptyCart();
    }

    const parsed = JSON.parse(raw) as Cart;
    if (!Array.isArray(parsed.items)) {
      return emptyCart();
    }

    const cart = withComputedTotals(parsed.items);
    saveCartToStorage(cart);

    return cart;
  } catch {
    return emptyCart();
  }
}

export function saveCartToStorage(cart: Cart): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

type ProductVariant = ShopProduct['variants'][number];

export function buildCartItemFromProduct(product: ShopProduct, variant: ProductVariant | null): CartItem | null {
  if (product.variants.length > 0 && !variant) {
    return null;
  }

  const price = variant?.price ?? product.price;
  if (typeof price !== 'number') {
    return null;
  }

  const selections = variant?.selections.map((selection) => ({
    option: selection.option,
    value: selection.value,
  }));
  const variantKey = getVariantKey(selections ?? []);
  const imageUrl = product.images[0]?.responsiveImage?.src ?? product.images[0]?.url ?? undefined;

  return {
    id: createLineItemId(product.id, variantKey),
    productId: product.id,
    productSlug: product.slug,
    productName: product.name,
    imageUrl,
    price,
    quantity: 1,
    selections: selections && selections.length > 0 ? selections : undefined,
  };
}

export function addItemToCart(cart: Cart, item: CartItem): Cart {
  const existing = cart.items.find((line) => line.id === item.id);

  if (existing) {
    const items = cart.items.map((line) =>
      line.id === item.id ? { ...line, quantity: line.quantity + item.quantity } : line,
    );

    return withComputedTotals(items);
  }

  return withComputedTotals([...cart.items, item]);
}

export function updateCartItemQuantity(cart: Cart, lineId: string, quantity: number): Cart {
  const items = cart.items
    .map((line) => (line.id === lineId ? { ...line, quantity } : line))
    .filter((line) => line.quantity > 0);

  return withComputedTotals(items);
}

export function removeCartItem(cart: Cart, lineId: string): Cart {
  const items = cart.items.filter((line) => line.id !== lineId);

  return withComputedTotals(items);
}
