import { ShopProductsForCheckoutDocument } from '@/graphql/generated';
import { CheckoutShippingMethod } from '@/types/checkout';
import { CartSelection } from '@/utils/cart';
import { ProductCommerceMeta, mapProductsToCommerceMeta, resolveCartShippingCostChf } from '@/utils/product-commerce';
import { queryDatoCMS } from '@/utils/query-dato-cms';

export type CheckoutCartItemPayload = {
  productId: string;
  quantity: number;
  selections?: CartSelection[];
};

export type VerifiedCheckoutLineItem = {
  productId: string;
  name: string;
  quantity: number;
  unitPriceChf: number;
  imageUrl?: string;
};

type CheckoutProduct = {
  id: string;
  name: string;
  slug: string;
  price?: number | null;
  images: { url: string }[];
  variants: {
    price: number;
    selections: CartSelection[];
  }[];
};

function selectionsMatch(a: CartSelection[], b: CartSelection[]): boolean {
  if (a.length !== b.length) {
    return false;
  }

  const normalized = (selections: CartSelection[]) =>
    [...selections].sort((left, right) => left.option.localeCompare(right.option));

  const sortedA = normalized(a);
  const sortedB = normalized(b);

  return sortedA.every((selection, index) => {
    const other = sortedB[index];

    return selection.option === other?.option && selection.value === other?.value;
  });
}

function resolveUnitPrice(product: CheckoutProduct, selections?: CartSelection[]): number | null {
  if (product.variants.length > 0) {
    if (!selections || selections.length === 0) {
      return null;
    }

    const variant = product.variants.find((entry) => selectionsMatch(entry.selections, selections));

    return variant?.price ?? null;
  }

  return typeof product.price === 'number' ? product.price : null;
}

function formatLineItemName(productName: string, selections?: CartSelection[]): string {
  if (!selections || selections.length === 0) {
    return productName;
  }

  const variantLabel = selections.map((selection) => `${selection.option}: ${selection.value}`).join(', ');

  return `${productName} (${variantLabel})`;
}

export async function verifyCheckoutCartItems(items: CheckoutCartItemPayload[]): Promise<VerifiedCheckoutLineItem[]> {
  if (items.length === 0) {
    throw new Error('Der Warenkorb ist leer.');
  }

  const productIds = [...new Set(items.map((item) => item.productId))];
  const { allShopProducts } = await queryDatoCMS({
    document: ShopProductsForCheckoutDocument,
    variables: { ids: productIds },
  });

  const productsById = new Map(allShopProducts.map((product) => [product.id, product]));

  const verifiedItems: VerifiedCheckoutLineItem[] = [];

  for (const item of items) {
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 10) {
      throw new Error('Ungültige Produktmenge.');
    }

    const product = productsById.get(item.productId);
    if (!product) {
      throw new Error('Ein Produkt im Warenkorb ist nicht mehr verfügbar.');
    }

    const unitPriceChf = resolveUnitPrice(product, item.selections);
    if (unitPriceChf === null) {
      throw new Error(`Variante für «${product.name}» konnte nicht ermittelt werden.`);
    }

    verifiedItems.push({
      productId: product.id,
      name: formatLineItemName(product.name, item.selections),
      quantity: item.quantity,
      unitPriceChf,
      imageUrl: product.images[0]?.url,
    });
  }

  return verifiedItems;
}

export function chfToStripeAmount(chf: number): number {
  return Math.round(chf * 100);
}

export async function fetchCheckoutCommerceMeta(productIds: string[]): Promise<ProductCommerceMeta[]> {
  if (productIds.length === 0) {
    return [];
  }

  const { allShopProducts } = await queryDatoCMS({
    document: ShopProductsForCheckoutDocument,
    variables: { ids: productIds },
  });

  return mapProductsToCommerceMeta(
    allShopProducts.map((product) => ({
      id: product.id,
      name: product.name,
      deliveryTime: product.deliveryTime,
      shippingCost: product.shippingCost,
    })),
  );
}

export function computeCheckoutTotals(
  items: VerifiedCheckoutLineItem[],
  shipping: CheckoutShippingMethod,
  productCommerce: ProductCommerceMeta[] = [],
): { subTotalChf: number; shippingCostChf: number; grandTotalChf: number } {
  const subTotalChf = items.reduce((sum, item) => sum + item.unitPriceChf * item.quantity, 0);
  const shippingCostChf = resolveCartShippingCostChf(shipping, items, productCommerce);

  return {
    subTotalChf,
    shippingCostChf,
    grandTotalChf: subTotalChf + shippingCostChf,
  };
}
