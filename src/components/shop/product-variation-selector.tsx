'use client';

import { classNames } from '@/utils/css';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { Product, ProductOption, Variant } from 'swell-js';

type Props = {
  product: Product;
  setActiveVariant: (variant: Variant | null) => void;
};

type SelectedOptions = Record<string, string>;

export const ProductVariationSelector = ({ product, setActiveVariant }: Props) => {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});

  const defaultSelectedOptions = useMemo<SelectedOptions>(() => {
    const defaults: SelectedOptions = {};

    product.options?.forEach((option) => {
      if (option.values && option.values.length > 0 && option.id) {
        defaults[option.id] = option.values[0]?.id ?? '';
      }
    });

    return defaults;
  }, [product.options]);

  const resolvedSelectedOptions = useMemo<SelectedOptions>(() => {
    const resolved: SelectedOptions = { ...defaultSelectedOptions };

    for (const [optionId, valueId] of Object.entries(selectedOptions)) {
      if (optionId in resolved && valueId) {
        resolved[optionId] = valueId;
      }
    }

    return resolved;
  }, [defaultSelectedOptions, selectedOptions]);

  const handleOptionSelect = (optionId: string, valueId: string) => {
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [optionId]: valueId,
    }));
  };

  useEffect(() => {
    const matchingVariant = product.variants?.results.find((variant) => {
      return Object.entries(resolvedSelectedOptions).every(([, valueId]) => variant.option_value_ids?.includes(valueId));
    });

    setActiveVariant(matchingVariant ?? null);
  }, [resolvedSelectedOptions, product.variants?.results, setActiveVariant]);

  return (
    <>
      {product.options?.map((option: ProductOption) => {
        if (!option.id) {
          return null;
        }

        const optionId = option.id;

        return (
          <div key={optionId} className="mb-4">
            <label className="block text-sm font-medium">{option.name}</label>
            <Menu as="div" className="relative inline-block w-full text-left">
              <div>
                <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded bg-white px-3 py-2 text-sm font-bold text-gray-900 shadow-sm ring-1 ring-gray-300 ring-inset hover:bg-gray-50">
                  {option.values?.find((value) => value.id === resolvedSelectedOptions[optionId])?.name}
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
                    {option.values?.map((value) => {
                      const valueId = value.id;

                      if (!valueId) {
                        return null;
                      }

                      return (
                        <Menu.Item key={valueId}>
                          <span
                            className={classNames(
                              valueId === resolvedSelectedOptions[optionId] ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                              'block px-4 py-2 text-sm hover:bg-gray-100',
                            )}
                            onClick={() => handleOptionSelect(optionId, valueId)}
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
