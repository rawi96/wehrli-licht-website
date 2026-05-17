'use client';

import { ShopProduct } from '@/utils/shop';
import { classNames } from '@/utils/css';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Fragment, useEffect, useMemo, useState } from 'react';

type ProductVariant = ShopProduct['variants'][number];
type SelectedOptions = Record<string, string>;

type Props = {
  product: ShopProduct;
  setActiveVariant: (variant: ProductVariant | null) => void;
};

const getOptionGroups = (variants: ProductVariant[]): { option: string; values: string[] }[] => {
  const groups = new Map<string, Set<string>>();

  for (const variant of variants) {
    for (const selection of variant.selections) {
      const values = groups.get(selection.option) ?? new Set<string>();
      values.add(selection.value);
      groups.set(selection.option, values);
    }
  }

  return [...groups.entries()].map(([option, values]) => ({
    option,
    values: [...values],
  }));
};

const findMatchingVariant = (variants: ProductVariant[], selectedOptions: SelectedOptions): ProductVariant | null => {
  return (
    variants.find((variant) =>
      variant.selections.every((selection) => selectedOptions[selection.option] === selection.value),
    ) ?? null
  );
};

export const ProductVariationSelector = ({ product, setActiveVariant }: Props) => {
  const optionGroups = useMemo(() => getOptionGroups(product.variants), [product.variants]);

  const defaultSelectedOptions = useMemo<SelectedOptions>(() => {
    const defaults: SelectedOptions = {};

    for (const group of optionGroups) {
      defaults[group.option] = group.values[0] ?? '';
    }

    return defaults;
  }, [optionGroups]);

  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});

  const resolvedSelectedOptions = useMemo<SelectedOptions>(() => {
    const resolved: SelectedOptions = { ...defaultSelectedOptions };

    for (const [option, value] of Object.entries(selectedOptions)) {
      if (option in resolved && value) {
        resolved[option] = value;
      }
    }

    return resolved;
  }, [defaultSelectedOptions, selectedOptions]);

  const handleOptionSelect = (option: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [option]: value,
    }));
  };

  useEffect(() => {
    setActiveVariant(findMatchingVariant(product.variants, resolvedSelectedOptions));
  }, [resolvedSelectedOptions, product.variants, setActiveVariant]);

  if (optionGroups.length === 0) {
    return null;
  }

  return (
    <>
      {optionGroups.map((group) => (
        <div key={group.option} className="mb-4">
          <label className="block text-sm font-medium">{group.option}</label>
          <Menu as="div" className="relative inline-block w-full text-left">
            <div>
              <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded bg-white px-3 py-2 text-sm font-bold text-gray-900 shadow-sm ring-1 ring-gray-300 ring-inset hover:bg-gray-50">
                {resolvedSelectedOptions[group.option]}
                <ChevronDownIcon className="-mr-1 h-5 w-5" aria-hidden="true" />
              </Menu.Button>
            </div>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="ring-opacity-5 absolute right-0 z-10 mt-2 w-full origin-top-right cursor-pointer rounded bg-white shadow-lg ring-1 ring-black focus:outline-none">
                <div className="py-1">
                  {group.values.map((value) => (
                    <Menu.Item key={value}>
                      <span
                        className={classNames(
                          value === resolvedSelectedOptions[group.option] ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm hover:bg-gray-100',
                        )}
                        onClick={() => handleOptionSelect(group.option, value)}
                      >
                        {value}
                      </span>
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      ))}
    </>
  );
};
