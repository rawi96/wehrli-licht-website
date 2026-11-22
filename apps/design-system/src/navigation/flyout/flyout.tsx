'use client';

import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { FC, Fragment } from 'react';

export type NavigationLink = {
  label: string;
  href: string;
};

type Props = {
  label: string;
  items: NavigationLink[];
  /** The current page is in this section: the label is underlined. */
  active?: boolean;
};

/** A main navigation entry with sub pages: the label opens a white panel with the links. */
export const Flyout: FC<Props> = ({ label, items, active }) => (
  <Popover>
    {({ close }) => (
      <>
        <PopoverButton
          className={`inline-flex items-center gap-x-1 border-b-2 pb-0.5 text-sm leading-none font-bold text-white transition-colors duration-150 ${
            active ? 'border-white' : 'border-transparent'
          } hover:border-white`}
        >
          <span>{label}</span>
          <ChevronDownIcon className="size-4 shrink-0" aria-hidden="true" />
        </PopoverButton>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <PopoverPanel className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-min -translate-x-1/2 px-4">
            <div className="surface-light w-56 shrink rounded-md bg-white p-4 text-sm font-bold">
              {items.map((item) => (
                <Link key={item.label} href={item.href} className="hover:text-wehrli block p-2" onClick={() => close()}>
                  {item.label}
                </Link>
              ))}
            </div>
          </PopoverPanel>
        </Transition>
      </>
    )}
  </Popover>
);
