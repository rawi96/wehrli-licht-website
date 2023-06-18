import { Popover, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import { Fragment } from 'react'
import { AnalyticsListener } from '../AnalyticsListener'
import { FlyoutProps } from './types'

export const Flyout = ({ title, items }: FlyoutProps) => {
  return (
    <Popover className="">
      <Popover.Button className="focus:outline.white inline-flex items-center gap-x-1 text-sm leading-6 text-white focus:outline-wehrli">
        <span>{title}</span>
        <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
      </Popover.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-min -translate-x-1/2 px-4">
          <div className="w-56 shrink rounded-lg bg-white p-4 text-sm font-semibold leading-6 text-gray-900 shadow-lg ring-1 ring-gray-900/5">
            {items.map((item) => (
              <AnalyticsListener key={item.name} buttonName={item.name}>
                <Link href={item.href} className="block p-2 hover:text-wehrli">
                  {item.name}
                </Link>
              </AnalyticsListener>
            ))}
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}
