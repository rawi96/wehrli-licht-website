'use client';

import { ShopCategory } from '@/utils/shop';
import { createContext, FC, PropsWithChildren, useContext } from 'react';

const ShopNavContext = createContext<ShopCategory[]>([]);

type Props = PropsWithChildren<{
  categories: ShopCategory[];
}>;

export const ShopNavProvider: FC<Props> = ({ categories, children }) => (
  <ShopNavContext.Provider value={categories}>{children}</ShopNavContext.Provider>
);

export const useShopCategories = (): ShopCategory[] => useContext(ShopNavContext);
