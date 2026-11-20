import { cartCheckoutFingerprint } from '@/domain/checkout/cart-items';
import { CommerceRequestBody, CommerceResponse } from '@/features/checkout/schemas';
import { Cart } from '@/domain/shop/cart';
import { ProductCommerceMeta } from '@/domain/shop/commerce';
import { useEffect, useState } from 'react';

export const useCheckoutCommerce = (cart: Cart, isHydrated: boolean, draftLoaded: boolean): ProductCommerceMeta[] => {
  const [productCommerce, setProductCommerce] = useState<ProductCommerceMeta[]>([]);
  const cartFingerprint = cartCheckoutFingerprint(cart);

  useEffect(() => {
    if (!isHydrated || !draftLoaded || cart.items.length === 0) {
      return;
    }

    const productIds = [...new Set(cart.items.map((item) => item.productId))];

    fetch('/api/shop/checkout/commerce', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productIds } satisfies CommerceRequestBody),
    })
      .then((response) => response.json())
      .then((data: CommerceResponse) => {
        if (data.commerce) {
          setProductCommerce(data.commerce);
        }
      })
      .catch(() => undefined);
  }, [isHydrated, draftLoaded, cartFingerprint, cart.items]);

  return productCommerce;
};
