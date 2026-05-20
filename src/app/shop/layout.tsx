import { ShopNavProvider } from '@/app/context/shop-nav-context';
import { getAllCategories } from '@/utils/shop';
import { ReactNode } from 'react';

export default async function ShopLayout({ children }: { children: ReactNode }) {
  const categories = await getAllCategories();

  return <ShopNavProvider categories={categories}>{children}</ShopNavProvider>;
}
