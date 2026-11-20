'use client';

import { MAX_LINE_QUANTITY } from '@/constants/shop-commerce';
import { useShopContext } from '@/app/context/shop-context';
import { SHOP_HOME_PATH } from '@/constants/shop-paths';
import { toCartLine } from '@/utils/cart';
import { formatPriceToCHF } from '@/utils/price';
import { CartContent, CartDialog } from '@wehrli/design-system';
import { useRouter } from 'next/navigation';

/**
 * The cart dialog, rendered once in the root layout. Not per header: Next.js keeps the previous page hidden in the DOM,
 * so a dialog per page would open twice (one over the other) after a client-side navigation.
 */
export const ShoppingCart = () => {
  const router = useRouter();
  const {
    shoppingCart,
    updateItemQuantity,
    removeItem,
    isHydrated,
    isShowCart: open,
    setIsShowCart: setOpen,
  } = useShopContext();

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
