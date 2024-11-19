'use client';

import { classNames } from '@/utils/css';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Fragment, useEffect, useState } from 'react';
import { Product, ProductOption, Variant } from 'swell-js';

type Props = {
  product: Product;
  setActiveVariant: (variant: Variant | null) => void;
};

type SelectedOptions = Record<string, string>;

export const ProductVariationSelector = ({ product, setActiveVariant }: Props) => {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});

  const handleOptionSelect = (optionId: string, valueId: string) => {
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [optionId]: valueId,
    }));
  };

  useEffect(() => {
    const initialSelectedOptions: SelectedOptions = {};

    product.options?.forEach((option) => {
      if (option.values && option.values.length > 0 && option.id) {
        initialSelectedOptions[option.id] = option.values[0]?.id ?? '';
      }
    });

    setSelectedOptions(initialSelectedOptions);
  }, [product.options]);

  useEffect(() => {
    const matchingVariant = product.variants?.results.find((variant) => {
      return Object.entries(selectedOptions).every(([, valueId]) => variant.option_value_ids?.includes(valueId));
    });

    setActiveVariant(matchingVariant ?? null);
  }, [selectedOptions, product.variants?.results, setActiveVariant]);

  return (
    <>
      {product.options?.map((option: ProductOption) => {
        if (!option.id) {
          return null;
        }

        return (
          <div key={option.id} className="mb-4">
            <label className="block text-sm font-medium text-gray-700">{option.name}</label>
            <Menu as="div" className="relative inline-block w-full text-left">
              <div>
                <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                  {option.values?.find((value) => value.id === selectedOptions[option.id!])?.name}
                  <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
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
                <Menu.Items className="absolute right-0 z-10 mt-2 w-full origin-top-right cursor-pointer rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {option.values?.map((value) => {
                      if (!value.id) {
                        return null;
                      }

                      return (
                        <Menu.Item key={value.id}>
                          <span
                            className={classNames(
                              value.id === selectedOptions[option.id!] ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                              'block px-4 py-2 text-sm hover:bg-gray-100',
                            )}
                            onClick={() => handleOptionSelect(option.id!, value.id!)}
                          >
                            {value.name}
                          </span>
                        </Menu.Item>
                      );
                    })}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        );
      })}
    </>
  );
};
