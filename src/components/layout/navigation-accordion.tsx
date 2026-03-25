import { NavigationItemRecord } from '@/graphql/generated';
import { Disclosure } from '@headlessui/react';
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

type Props = {
  title: string;
  items: NavigationItemRecord[];
  prefix: string;
  onLinkClick?: () => void;
};

export const NavigationAccordion = ({ title, items, prefix, onLinkClick }: Props) => (
  <Disclosure as="div" key={title}>
    {({ open }) => (
      <>
        <dt>
          <Disclosure.Button className="hover:bg-wehrli-400 -mx-3 flex w-full items-start justify-between rounded px-3 py-2 text-sm leading-7 font-bold text-white">
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
              className="hover:bg-wehrli-400 block rounded p-2 px-3 py-2 text-white"
              onClick={onLinkClick}
            >
              {item.label}
            </Link>
          ))}
        </Disclosure.Panel>
      </>
    )}
  </Disclosure>
);
