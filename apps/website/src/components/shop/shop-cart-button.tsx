'use client';

import { useShopContext } from '@/app/context/shop-context';
import { CartButton } from '@wehrli/design-system';
import { FC } from 'react';

export const ShopCartButton: FC = () => {
  const { shoppingCart, setIsShowCart } = useShopContext();

  return <CartButton quantity={shoppingCart.item_quantity} onClick={() => setIsShowCart(true)} />;
};
