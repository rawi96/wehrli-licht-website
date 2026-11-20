import { MAX_LINE_QUANTITY } from '@/domain/shop/commerce';
import type { Product, ProductVariant, VariantSelection } from '@/domain/shop/product';

// The cart as plain data and the rules to change it. Where it is kept (browser storage) is up to the UI.

export type CartSelection = VariantSelection;

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

export const emptyCart = (): Cart => ({
  items: [],
  item_quantity: 0,
  sub_total: 0,
  shipment_price: 0,
  grand_total: 0,
});

export const getVariantKey = (selections: CartSelection[]): string => {
  if (selections.length === 0) {
    return '';
  }

  return [...selections]
    .sort((a, b) => a.option.localeCompare(b.option))
    .map((selection) => `${selection.option}:${selection.value}`)
    .join('|');
};

export const createLineItemId = (productId: string, variantKey: string): string =>
  variantKey ? `${productId}::${variantKey}` : productId;

const computeTotals = (items: CartItem[]): Pick<Cart, 'item_quantity' | 'sub_total' | 'shipment_price' | 'grand_total'> => {
  const item_quantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const sub_total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipment_price = 0;

  return {
    item_quantity,
    sub_total,
    shipment_price,
    grand_total: sub_total + shipment_price,
  };
};

/** Cart with totals; line quantities are capped at MAX_LINE_QUANTITY (also for carts restored from storage). */
export const withComputedTotals = (lines: CartItem[]): Cart => {
  const items = lines.map((line) => (line.quantity > MAX_LINE_QUANTITY ? { ...line, quantity: MAX_LINE_QUANTITY } : line));

  return { items, ...computeTotals(items) };
};

/** A cart line for one unit of the product (in the chosen variant); null if it cannot be bought that way. */
export const buildCartItemFromProduct = (product: Product, variant: ProductVariant | null): CartItem | null => {
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
  const imageUrl = product.images[0]?.responsive?.src ?? product.images[0]?.url ?? undefined;

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
};

export const addItemToCart = (cart: Cart, item: CartItem): Cart => {
  const existing = cart.items.find((line) => line.id === item.id);

  if (existing) {
    const items = cart.items.map((line) =>
      line.id === item.id ? { ...line, quantity: line.quantity + item.quantity } : line,
    );

    return withComputedTotals(items);
  }

  return withComputedTotals([...cart.items, item]);
};

export const updateCartItemQuantity = (cart: Cart, lineId: string, quantity: number): Cart => {
  const items = cart.items
    .map((line) => (line.id === lineId ? { ...line, quantity } : line))
    .filter((line) => line.quantity > 0);

  return withComputedTotals(items);
};

export const removeCartItem = (cart: Cart, lineId: string): Cart => {
  const items = cart.items.filter((line) => line.id !== lineId);

  return withComputedTotals(items);
};

/** The chosen variant of a cart line, e.g. "Farbe: Weiss, Grösse: M". */
export const formatCartSelections = (selections: CartSelection[] | undefined): string | undefined =>
  selections && selections.length > 0
    ? selections.map((selection) => `${selection.option}: ${selection.value}`).join(', ')
    : undefined;
