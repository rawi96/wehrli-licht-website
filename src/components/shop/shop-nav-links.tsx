'use client';

import { getShopCategoryPath, SHOP_ALL_PRODUCTS_PATH } from '@/constants/shop-paths';
import { ShopCategory } from '@/utils/shop';
import { classNames } from '@/utils/css';
import Link from 'next/link';
import NextImage from 'next/image';
import { usePathname } from 'next/navigation';
import { FC } from 'react';

type Props = {
  categories: ShopCategory[];
  activeCategorySlug?: string;
  showAllProductsActive?: boolean;
  linkClassName?: string;
  activeLinkClassName?: string;
  onLinkClick?: () => void;
  variant?: 'sidebar' | 'plain';
};

const sidebarLinkClassName =
  'group relative flex items-center gap-3 rounded-lg py-2 pr-2 pl-3 text-sm font-medium text-gray-600 transition-colors hover:bg-white-300 hover:text-wehrli';
const sidebarActiveLinkClassName = 'bg-white-300 font-semibold text-wehrli';

const CategoryThumbnail = ({ category }: { category: ShopCategory }) => {
  const src = category.image?.responsiveImage?.src;
  if (!src) {
    return null;
  }

  return (
    <span className="relative size-9 shrink-0 overflow-hidden rounded-md bg-gray-100 ring-1 ring-gray-200/80">
      <NextImage src={src} alt="" width={36} height={36} sizes="36px" loading="lazy" className="size-full object-cover" />
    </span>
  );
};

const SidebarActiveBar = ({ active }: { active: boolean }) => (
  <span
    aria-hidden="true"
    className={classNames(
      'bg-wehrli absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 rounded-full transition-opacity',
      active ? 'opacity-100' : 'opacity-0 group-hover:opacity-40',
    )}
  />
);

export const ShopNavLinks: FC<Props> = ({
  categories,
  activeCategorySlug,
  showAllProductsActive,
  linkClassName,
  activeLinkClassName,
  onLinkClick,
  variant = 'sidebar',
}) => {
  const pathname = usePathname();
  const isSidebar = variant === 'sidebar';
  const isAllProductsPage = showAllProductsActive ?? pathname === SHOP_ALL_PRODUCTS_PATH;

  const baseLinkClassName = linkClassName ?? (isSidebar ? sidebarLinkClassName : 'block text-sm');
  const activeClassName =
    activeLinkClassName ?? (isSidebar ? classNames(sidebarLinkClassName, sidebarActiveLinkClassName) : '');

  const linkClass = (active: boolean) => classNames(baseLinkClassName, active && activeClassName);

  return (
    <ul className={isSidebar ? 'space-y-0.5' : 'space-y-1'}>
      <li>
        <Link
          href={SHOP_ALL_PRODUCTS_PATH}
          prefetch={false}
          className={linkClass(isAllProductsPage)}
          aria-current={isAllProductsPage ? 'page' : undefined}
          onClick={onLinkClick}
        >
          {isSidebar && <SidebarActiveBar active={isAllProductsPage} />}
          <span className="truncate">Alle Leuchten</span>
        </Link>
      </li>
      {categories.map((category) => {
        const href = getShopCategoryPath(category.slug);
        const isActive = activeCategorySlug === category.slug || pathname === href;

        return (
          <li key={category.id}>
            <Link
              href={href}
              prefetch={false}
              className={linkClass(isActive)}
              aria-current={isActive ? 'page' : undefined}
              onClick={onLinkClick}
            >
              {isSidebar && <SidebarActiveBar active={isActive} />}
              {isSidebar && <CategoryThumbnail category={category} />}
              <span className="truncate">{category.name}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
