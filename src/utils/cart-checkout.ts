import { ShopProductsForCheckoutDocument } from '@/graphql/generated';
import { CheckoutShippingMethod } from '@/types/checkout';
import { CartSelection } from '@/utils/cart';
import { formatLineItemName, resolveUnitPrice } from '@/utils/cart-checkout-helpers';
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

export const verifyCheckoutCartItems = async (items: CheckoutCartItemPayload[]): Promise<VerifiedCheckoutLineItem[]> => {
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
};

export const chfToStripeAmount = (chf: number): number => Math.round(chf * 100);

export const fetchCheckoutCommerceMeta = async (productIds: string[]): Promise<ProductCommerceMeta[]> => {
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
};

export type CheckoutTotals = {
  subTotalChf: number;
  shippingCostChf: number;
  grandTotalChf: number;
};

export const computeCheckoutTotals = (
  items: VerifiedCheckoutLineItem[],
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
