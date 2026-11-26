'use client';

import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { FC, Fragment } from 'react';
import { cn } from '../../fundamentals/cn';

export type VariationOption = {
  /** Name of the option, e.g. "Farbe". */
  option: string;
  values: string[];
};

type Props = {
  options: VariationOption[];
  /** The chosen value per option name. */
  selected: Record<string, string>;
  onSelect: (option: string, value: string) => void;
};

/** One dropdown per product option (colour, size, ...). Renders nothing without options. */
export const VariationSelector: FC<Props> = ({ options, selected, onSelect }) => {
  if (options.length === 0) {
    return null;
  }

  return (
    <>
      {options.map((group) => (
        <div key={group.option} className="mb-4">
          <label className="block text-sm">{group.option}</label>
          <Menu as="div" className="relative inline-block w-full text-left">
            <div>
              <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-bold text-black shadow-sm ring-1 ring-gray-200 ring-inset hover:bg-gray-50">
                {selected[group.option]}
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
              <Menu.Items className="absolute right-0 z-10 mt-2 w-full origin-top-right cursor-pointer rounded-md bg-white shadow-lg ring-1 ring-black focus:outline-none">
                <div className="py-1">
                  {group.values.map((value) => (
                    <Menu.Item key={value}>
                      <span
                        className={cn(
                          value === selected[group.option] ? 'bg-gray-100 text-black' : 'text-gray-600',
                          'block px-4 py-2 text-sm hover:bg-gray-100',
                        )}
                        onClick={() => onSelect(group.option, value)}
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
