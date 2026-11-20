import { ShopNavProvider } from '@/components/shop/shop-nav-context';
import { catalog } from '@/integrations';
import { ReactNode } from 'react';

export default async function ShopLayout({ children }: { children: ReactNode }) {
  const categories = await catalog.listCategories();

  return <ShopNavProvider categories={categories}>{children}</ShopNavProvider>;
}
