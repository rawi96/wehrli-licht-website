'use client';

import { getShopSortLabel, SHOP_PRODUCT_SORT_OPTIONS, ShopProductSortKey } from '@/utils/shop-product-list';
import { classNames } from '@/utils/css';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import { FC } from 'react';

type Props = {
  value: ShopProductSortKey;
  onChange: (value: ShopProductSortKey) => void;
};

export const ShopProductSort: FC<Props> = ({ value, onChange }) => {
  const activeLabel = getShopSortLabel(value);

  return (
    <Menu as="div" className="relative shrink-0">
      <MenuButton
        type="button"
        className="field-focus-plain rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        aria-label={`Sortieren: ${activeLabel}`}
      >
        <ArrowsUpDownIcon aria-hidden="true" className="size-6" />
      </MenuButton>

      <MenuItems
        transition
        anchor="bottom end"
        className="z-10 mt-1 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75"
      >
        {SHOP_PRODUCT_SORT_OPTIONS.map((option) => (
          <MenuItem key={option.value}>
            <button
              type="button"
              role="menuitemradio"
              aria-checked={value === option.value}
              onClick={() => onChange(option.value)}
              className={classNames(
                'block w-full px-4 py-2 text-left text-sm data-[focus]:bg-gray-100 data-[focus]:outline-none',
                value === option.value ? 'font-medium text-gray-900' : 'text-gray-600',
              )}
            >
              {option.label}
            </button>
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
};
