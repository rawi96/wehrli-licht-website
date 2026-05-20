'use client';

import { ShopCategory } from '@/utils/shop';
import { classNames } from '@/utils/css';
import { Squares2X2Icon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC } from 'react';

type Props = {
  categories: ShopCategory[];
  activeCategorySlug?: string;
  linkClassName?: string;
  activeLinkClassName?: string;
  onLinkClick?: () => void;
  showIcons?: boolean;
};

const sidebarLinkClasses =
  'group flex gap-x-3 rounded-md p-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-white-300 hover:text-wehrli';
const sidebarActiveClasses = 'bg-white-300 text-wehrli';
const sidebarIconClasses = 'size-6 shrink-0 text-gray-400 group-hover:text-wehrli';
const sidebarIconActiveClasses = 'text-wehrli';
const sidebarInitialClasses =
  'flex size-6 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-[0.625rem] font-medium text-gray-500 group-hover:border-wehrli group-hover:text-wehrli';
const sidebarInitialActiveClasses = 'border-wehrli text-wehrli';

const getCategoryInitial = (name: string) => name.trim().charAt(0).toUpperCase() || '?';

export const ShopNavLinks: FC<Props> = ({
  categories,
  activeCategorySlug,
  linkClassName,
  activeLinkClassName,
  onLinkClick,
  showIcons = true,
}) => {
  const pathname = usePathname();
  const isShopHome = pathname === '/shop';
  const useSidebarStyles = showIcons && !linkClassName;

  const resolvedLinkClassName = linkClassName ?? sidebarLinkClasses;
  const resolvedActiveLinkClassName = activeLinkClassName ?? classNames(sidebarLinkClasses, sidebarActiveClasses);

  return (
    <ul role="list" className={useSidebarStyles ? '-mx-2 space-y-1' : 'space-y-1'}>
      <li>
        <Link
          href="/shop"
          className={classNames(resolvedLinkClassName, isShopHome && resolvedActiveLinkClassName)}
          aria-current={isShopHome ? 'page' : undefined}
          onClick={onLinkClick}
        >
          {useSidebarStyles && (
            <Squares2X2Icon
              aria-hidden="true"
              className={classNames(sidebarIconClasses, isShopHome && sidebarIconActiveClasses)}
            />
          )}
          <span className="truncate">Alle Kategorien</span>
        </Link>
      </li>
      {categories.map((category) => {
        const href = `/shop/kategorien/${category.slug}`;
        const isActive = activeCategorySlug === category.slug || pathname === href;

        return (
          <li key={category.id}>
            <Link
              href={href}
              className={classNames(resolvedLinkClassName, isActive && resolvedActiveLinkClassName)}
              aria-current={isActive ? 'page' : undefined}
              onClick={onLinkClick}
            >
              {useSidebarStyles && (
                <span
                  aria-hidden="true"
                  className={classNames(sidebarInitialClasses, isActive && sidebarInitialActiveClasses)}
                >
                  {getCategoryInitial(category.name)}
                </span>
              )}
              <span className="truncate">{category.name}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
