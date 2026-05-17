'use client';

import { ShopProduct } from '@/utils/shop';
import {
  Cart,
  addItemToCart,
  buildCartItemFromProduct,
  emptyCart,
  loadCartFromStorage,
  removeCartItem,
  saveCartToStorage,
  updateCartItemQuantity,
} from '@/utils/cart';
import { ReactElement, ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react';

type ProductVariant = ShopProduct['variants'][number];

export type ShopContextType = {
  shoppingCart: Cart;
  addToCart: (product: ShopProduct, variant: ProductVariant | null) => boolean;
  updateItemQuantity: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
  clearCart: () => void;
  isShowCart: boolean;
  setIsShowCart: (isShowCart: boolean) => void;
  isHydrated: boolean;
};

export const shopContextDefaultValues: ShopContextType = {
  shoppingCart: emptyCart(),
  addToCart: () => {
    console.error('addToCart is not initialized!');

    return false;
  },
  updateItemQuantity: () => {
    console.error('updateItemQuantity is not initialized!');
  },
  removeItem: () => {
    console.error('removeItem is not initialized!');
  },
  clearCart: () => {
    console.error('clearCart is not initialized!');
  },
  isShowCart: false,
  setIsShowCart: () => {
    console.error('setIsShowCart is not initialized!');
  },
  isHydrated: false,
};

export const ShopContext = createContext<ShopContextType>(shopContextDefaultValues);

export const ShopContextProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const [shoppingCart, setShoppingCart] = useState<Cart>(emptyCart);
  const [isShowCart, setIsShowCart] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate cart from localStorage after mount (SSR-safe).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional client hydration
    setShoppingCart(loadCartFromStorage());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      saveCartToStorage(shoppingCart);
    }
  }, [shoppingCart, isHydrated]);

  const addToCart = useCallback((product: ShopProduct, variant: ProductVariant | null) => {
    const item = buildCartItemFromProduct(product, variant);
    if (!item) {
      return false;
    }

    setShoppingCart((cart) => addItemToCart(cart, item));

    return true;
  }, []);

  const updateItemQuantity = useCallback((lineId: string, quantity: number) => {
    setShoppingCart((cart) => updateCartItemQuantity(cart, lineId, quantity));
  }, []);

  const removeItem = useCallback((lineId: string) => {
    setShoppingCart((cart) => removeCartItem(cart, lineId));
  }, []);

  const clearCart = useCallback(() => {
    setShoppingCart(emptyCart());
  }, []);

  return (
    <ShopContext.Provider
      value={{
        shoppingCart,
        addToCart,
        updateItemQuantity,
        removeItem,
        clearCart,
        isShowCart,
        setIsShowCart,
        isHydrated,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShopContext = (): ShopContextType => useContext(ShopContext);
