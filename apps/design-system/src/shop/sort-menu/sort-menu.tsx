'use client';

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import { cn } from '../../fundamentals/cn';

export type SortOption<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  options: SortOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Accessible name of the button, followed by the active option: "Sortieren: Empfohlen". */
  label?: string;
};

/** Icon button with a menu to sort a list. */
export const SortMenu = <T extends string>({ options, value, onChange, label = 'Sortieren' }: Props<T>) => {
  const activeLabel = options.find((option) => option.value === value)?.label ?? options[0]?.label;

  return (
    <Menu as="div" className="relative shrink-0">
      <MenuButton
        type="button"
        className="field-focus-plain p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        aria-label={`${label}: ${activeLabel}`}
      >
        <ArrowsUpDownIcon aria-hidden="true" className="size-6" />
      </MenuButton>

      <MenuItems
        transition
        anchor="bottom end"
        className="z-10 mt-1 w-48 origin-top-right bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75"
      >
        {options.map((option) => (
          <MenuItem key={option.value}>
            <button
              type="button"
              role="menuitemradio"
              aria-checked={value === option.value}
              onClick={() => onChange(option.value)}
              className={cn(
                'block w-full px-4 py-2 text-left text-sm data-[focus]:bg-gray-100 data-[focus]:outline-none',
                value === option.value ? 'text-gray-900' : 'text-gray-600',
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
