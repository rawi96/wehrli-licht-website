import { FC, ReactNode } from 'react';

type Props = {
  /** The category navigation, shown in a sticky sidebar from lg (hidden below). */
  sidebar: ReactNode;
  children: ReactNode;
};

/** Shop pages with the category sidebar: catalog, category and product pages. */
export const ShopBrowseLayout: FC<Props> = ({ sidebar, children }) => (
  <div className="lg:flex lg:items-start lg:gap-12">
    <aside className="hidden border-r border-gray-200 pr-6 lg:sticky lg:top-8 lg:block lg:w-56 lg:shrink-0 lg:self-start">
      {sidebar}
    </aside>
    <div className="min-w-0 flex-1">{children}</div>
  </div>
);
