'use client';

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { FC, ReactNode } from 'react';

type Props = {
  /** Text of the button, e.g. «Genau einstellen». */
  label: string;
  children: ReactNode;
};

/** Extra options folded away behind a button, so the main choice stays simple. */
export const MoreOptions: FC<Props> = ({ label, children }) => (
  <Disclosure as="div" className="rounded-md border border-gray-200 bg-white">
    <DisclosureButton className="group text-wehrli flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-bold">
      {label}
      <ChevronDownIcon className="size-5 shrink-0 transition-transform group-data-open:rotate-180" aria-hidden />
    </DisclosureButton>
    <DisclosurePanel className="flex flex-col gap-6 border-t border-gray-200 p-4">{children}</DisclosurePanel>
  </Disclosure>
);
