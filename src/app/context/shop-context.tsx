'use client';

import { getCart } from '@/utils/shop';
import { ReactElement, ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { Cart } from 'swell-js';

export type ShopContextType = {
  shoppingCart: Cart | null;
  setShoppingCart: (cart: Cart) => void;
  isShowCart: boolean;
  setIsShowCart: (isShowCart: boolean) => void;
};

export const shopContextDefaultValues: ShopContextType = {
  shoppingCart: null,
  setShoppingCart: () => {
    console.error('setShoppingCart is not initialized!');
  },
  isShowCart: false,
  setIsShowCart: () => {
    console.error('setIsShowCart is not initialized!');
  },
};

export const ShopContext = createContext<ShopContextType>(shopContextDefaultValues);

export const ShopContextProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const [shoppingCart, setShoppingCart] = useState<Cart | null>(null);
  const [isShowCart, setIsShowCart] = useState<boolean>(false);

  useEffect(() => {
    async function fetchCart() {
      const cart = await getCart();
      setShoppingCart(cart);
    }
    void fetchCart();
  }, []);

  return (
    <ShopContext.Provider
      value={{
        shoppingCart,
        setShoppingCart,
        isShowCart,
        setIsShowCart,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShopContext = (): ShopContextType => useContext(ShopContext);
