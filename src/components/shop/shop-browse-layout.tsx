'use client';

import { ShopSidebar } from '@/components/shop/shop-sidebar';
import { FC, PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
  activeCategorySlug?: string;
}>;

export const ShopBrowseLayout: FC<Props> = ({ activeCategorySlug, children }) => (
  <div className="lg:flex lg:items-start lg:gap-12">
    <aside className="hidden border-r border-gray-200 pr-6 lg:sticky lg:top-8 lg:block lg:w-56 lg:shrink-0 lg:self-start">
      <ShopSidebar activeCategorySlug={activeCategorySlug} />
    </aside>
    <div className="min-w-0 flex-1">{children}</div>
  </div>
);
