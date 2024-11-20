import { NavigationItemRecord } from '@/graphql/generated';
import { Disclosure } from '@headlessui/react';
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

type Props = {
  title: string;
  items: NavigationItemRecord[];
  prefix: string;
  onLinkClick?: () => void; // Callback für das Schließen des Menüs hinzufügen
};

export const NavigationAccordion = ({ title, items, prefix, onLinkClick }: Props) => (
  <Disclosure as="div" key={title}>
    {({ open }) => (
      <>
        <dt>
          <Disclosure.Button className="-mx-3 flex w-full items-start justify-between rounded px-3 py-2 text-xs font-bold leading-7 text-white hover:bg-wehrli-400">
            <span className="">{title}</span>
            <span className="ml-6 flex h-7 items-center">
              {open ? (
                <MinusSmallIcon className="h-6 w-6" aria-hidden="true" />
              ) : (
                <PlusSmallIcon className="h-6 w-6" aria-hidden="true" />
              )}
            </span>
          </Disclosure.Button>
        </dt>
        <Disclosure.Panel as="dd" className="mt-2 pr-12">
          {items?.map((item) => (
            <Link
              key={item.label}
              href={item.link?.slug ? `/${prefix}/${item.link.slug}` : '/'}
              className="block rounded p-2 px-3 py-2 text-white hover:bg-wehrli-400"
              onClick={onLinkClick} // Callback hinzufügen
            >
              {item.label}
            </Link>
          ))}
        </Disclosure.Panel>
      </>
    )}
  </Disclosure>
);
