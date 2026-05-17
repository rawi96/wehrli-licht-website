import { Cart } from '@/utils/cart';
import { cartCheckoutFingerprint } from '@/utils/build-checkout-payload';
import { ProductCommerceMeta } from '@/utils/product-commerce';
import { useEffect, useState } from 'react';

type CommerceResponse = { commerce?: ProductCommerceMeta[] };

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
      body: JSON.stringify({ productIds }),
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
