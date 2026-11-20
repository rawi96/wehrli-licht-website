'use client';

import { MAX_LINE_QUANTITY } from '@/constants/shop-commerce';
import { useShopContext } from '@/app/context/shop-context';
import { SHOP_HOME_PATH } from '@/constants/shop-paths';
import { toCartLine } from '@/utils/cart';
import { formatPriceToCHF } from '@/utils/price';
import { CartContent, CartDialog } from '@wehrli/design-system';
import { useRouter } from 'next/navigation';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const ShoppingCart = ({ open, setOpen }: Props) => {
  const router = useRouter();
  const { shoppingCart, updateItemQuantity, removeItem, isHydrated } = useShopContext();

  const handleGoToCheckout = () => {
    setOpen(false);
    router.push('/shop/checkout');
  };

  return (
    <CartDialog open={open} onClose={() => setOpen(false)}>
      <CartContent
        loading={!isHydrated}
        items={shoppingCart.items.map(toCartLine)}
        maxQuantity={MAX_LINE_QUANTITY}
        subtotal={formatPriceToCHF(shoppingCart.sub_total)}
        total={formatPriceToCHF(shoppingCart.sub_total)}
        onQuantityChange={updateItemQuantity}
        onRemove={removeItem}
        onGoToCheckout={handleGoToCheckout}
        shopHref={SHOP_HOME_PATH}
        onShopLinkClick={() => setOpen(false)}
      />
    </CartDialog>
  );
};
