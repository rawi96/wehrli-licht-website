'use client';

import type { Category } from '@/domain/shop/category';
import { createContext, FC, PropsWithChildren, useContext } from 'react';

const ShopNavContext = createContext<Category[]>([]);

type Props = PropsWithChildren<{
  categories: Category[];
}>;

export const ShopNavProvider: FC<Props> = ({ categories, children }) => (
  <ShopNavContext.Provider value={categories}>{children}</ShopNavContext.Provider>
);

export const useShopCategories = (): Category[] => useContext(ShopNavContext);
