import { MAX_LINE_QUANTITY } from '@/domain/shop/commerce';
import type { CheckoutProduct } from '@/domain/shop/checkout-product';
import { Cart, CartSelection, formatCartSelections } from '@/domain/shop/cart';

/** A cart line as the browser sends it to the checkout: only ids, quantities and selections, never prices. */
export type CheckoutCartItemPayload = {
  productId: string;
  quantity: number;
  selections?: CartSelection[];
};

/** A cart line checked against the catalog: name and price come from the product, not from the browser. */
export type VerifiedCheckoutLineItem = {
  productId: string;
  name: string;
  quantity: number;
  unitPriceChf: number;
  imageUrl?: string;
};

export const buildCheckoutItemsFromCart = (cart: Cart): CheckoutCartItemPayload[] =>
  cart.items.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
    selections: item.selections,
  }));

/** Changes whenever the checkout has to be verified again (products, quantities, selections). */
export const cartCheckoutFingerprint = (cart: Cart): string =>
  JSON.stringify(
    cart.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      selections: item.selections ?? [],
    })),
  );

export const selectionsMatch = (a: CartSelection[], b: CartSelection[]): boolean => {
  if (a.length !== b.length) {
    return false;
  }

  const normalized = (selections: CartSelection[]): CartSelection[] =>
    [...selections].sort((left, right) => left.option.localeCompare(right.option));

  const sortedA = normalized(a);
  const sortedB = normalized(b);

  return sortedA.every((selection, index) => {
    const other = sortedB[index];

    return selection.option === other?.option && selection.value === other?.value;
  });
};

export const resolveUnitPrice = (product: CheckoutProduct, selections?: CartSelection[]): number | null => {
  if (product.variants.length > 0) {
    if (!selections || selections.length === 0) {
      return null;
    }

    const variant = product.variants.find((entry) => selectionsMatch(entry.selections, selections));

    return variant?.price ?? null;
  }

  return typeof product.price === 'number' ? product.price : null;
};

export const formatLineItemName = (productName: string, selections?: CartSelection[]): string => {
  const variantLabel = formatCartSelections(selections);

  return variantLabel ? `${productName} (${variantLabel})` : productName;
};

export type VerifyCartItemsResult = { ok: true; items: VerifiedCheckoutLineItem[] } | { ok: false; error: string };

/** Checks the cart lines against the active products: quantities, availability and variant prices. */
export const verifyCheckoutCartItems = (
  items: CheckoutCartItemPayload[],
  products: CheckoutProduct[],
): VerifyCartItemsResult => {
  if (items.length === 0) {
    return { ok: false, error: 'Der Warenkorb ist leer.' };
  }

  const productsById = new Map(products.map((product) => [product.id, product]));
  const verifiedItems: VerifiedCheckoutLineItem[] = [];

  for (const item of items) {
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > MAX_LINE_QUANTITY) {
      return { ok: false, error: 'Ungültige Produktmenge.' };
    }

    const product = productsById.get(item.productId);
    if (!product) {
      return { ok: false, error: 'Ein Produkt im Warenkorb ist nicht mehr verfügbar.' };
    }

    const unitPriceChf = resolveUnitPrice(product, item.selections);
    if (unitPriceChf === null) {
      return { ok: false, error: `Variante für «${product.name}» konnte nicht ermittelt werden.` };
    }

    verifiedItems.push({
      productId: product.id,
      name: formatLineItemName(product.name, item.selections),
      quantity: item.quantity,
      unitPriceChf,
      imageUrl: product.imageUrl ?? undefined,
    });
  }

  return { ok: true, items: verifiedItems };
};
