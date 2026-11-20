'use client';

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { FC } from 'react';
import type { NavigationLink } from '../flyout/flyout';

type Props = {
  label: string;
  items: NavigationLink[];
  /** Called when a link is clicked, e.g. to close the mobile menu. */
  onNavigate?: () => void;
};

/** A main navigation entry with sub pages in the mobile menu: the label expands the links below it. */
export const NavigationAccordion: FC<Props> = ({ label, items, onNavigate }) => (
  <Disclosure as="div">
    {({ open }) => (
      <>
        <dt>
          <DisclosureButton className="hover:bg-wehrli-400 -mx-3 flex w-full items-start justify-between rounded-lg px-3 py-2 text-sm leading-7 font-bold text-white">
            <span>{label}</span>
            <span className="ml-6 flex h-7 items-center">
              {open ? (
                <MinusSmallIcon className="h-6 w-6" aria-hidden="true" />
              ) : (
                <PlusSmallIcon className="h-6 w-6" aria-hidden="true" />
              )}
            </span>
          </DisclosureButton>
        </dt>
        <DisclosurePanel as="dd" className="mt-2 pr-12">
          {items.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="hover:bg-wehrli-400 block rounded-lg p-2 px-3 py-2 text-white"
              onClick={onNavigate}
            >
              {item.label}
            </Link>
          ))}
        </DisclosurePanel>
      </>
    )}
  </Disclosure>
);
