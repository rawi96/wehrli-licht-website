'use client';

import { useShopContext } from '@/app/context/shop-context';
import { CartButton } from '@wehrli/design-system';
import { FC } from 'react';

type Props = {
  onClick?: () => void;
};

export const ShopCartButton: FC<Props> = ({ onClick }) => {
  const { shoppingCart, setIsShowCart } = useShopContext();

  return (
    <CartButton
      quantity={shoppingCart.item_quantity}
      onClick={() => {
        setIsShowCart(true);
        onClick?.();
      }}
    />
  );
};
