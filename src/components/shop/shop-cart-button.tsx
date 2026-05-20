'use client';

import { useShopContext } from '@/app/context/shop-context';
import { classNames } from '@/utils/css';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { FC } from 'react';

type Props = {
  className?: string;
  onClick?: () => void;
};

export const ShopCartButton: FC<Props> = ({ className, onClick }) => {
  const { shoppingCart, setIsShowCart } = useShopContext();
  const quantity = shoppingCart.item_quantity;

  return (
    <button
      type="button"
      className={classNames(
        'relative inline-flex items-center text-sm font-bold text-white transition-colors hover:text-white/90',
        className,
      )}
      onClick={() => {
        setIsShowCart(true);
        onClick?.();
      }}
      aria-label={quantity > 0 ? `Warenkorb, ${quantity} Artikel` : 'Warenkorb öffnen'}
    >
      <span className="relative inline-flex shrink-0">
        <ShoppingBagIcon className="h-6 w-6" aria-hidden="true" />
        {quantity > 0 && (
          <span className="text-wehrli absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-0.5 text-[10px] leading-none font-bold tabular-nums">
            {quantity > 99 ? '99+' : quantity}
          </span>
        )}
      </span>
    </button>
  );
};
