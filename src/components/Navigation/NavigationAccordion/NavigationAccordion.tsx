import { Disclosure } from '@headlessui/react'
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { AnalyticsListener } from '../../AnalyticsListener'
import { NavigationAccordionProps } from './types'

export const NavigationAccordion = ({
  title,
  items,
}: NavigationAccordionProps) => {
  return (
    <Disclosure as="div" key={title}>
      {({ open }) => (
        <>
          <dt>
            <Disclosure.Button className="-mx-3 flex w-full items-start justify-between rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-400/10">
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
            {items.map((item) => (
              <AnalyticsListener key={item.name} buttonName={item.name}>
                <Link
                  href={item.href}
                  className="block rounded-lg p-2 px-3 py-2 text-white hover:bg-gray-400/10"
                >
                  {item.name}
                </Link>
              </AnalyticsListener>
            ))}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
