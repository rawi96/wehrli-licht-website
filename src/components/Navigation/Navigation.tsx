import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { useState } from 'react'
import { NavigationAccordion } from './NavigationAccordion'
import { Flyout } from './NavigationFlyout'

import { NavigationType } from './types'

const navigation: NavigationType = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/shop' },
  {
    title: 'Angebot',
    items: [
      { name: 'Lichtplanung', href: '#' },
      { name: 'Lichtberatung', href: '#' },
      { name: 'Lampenschirme', href: '#' },
      { name: 'Wohnraumleuchten', href: '#' },
      { name: 'Sonderanfertigungen', href: '#' },
    ],
  },
  {
    title: 'Über uns',
    items: [
      { name: 'Team', href: '#' },
      { name: 'Geschichte', href: '#' },
    ],
  },
  { name: 'Projekte', href: '/projekte' },
  { name: 'Kontakt', href: '/kontakt' },
]

export const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <nav
        className="flex items-center justify-between pt-6"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Wehrli Licht GmbH</span>
            <Image
              src="/logos/wehrli_licht_logo.svg"
              alt="Wehrli Licht Logo"
              width={200}
              height={60}
            />
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Menu öffnen</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => {
            return 'items' in item ? (
              <Flyout key={item.title} title={item.title} items={item.items} />
            ) : (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-semibold leading-6 text-white"
              >
                {item.name}
              </a>
            )
          })}
        </div>
      </nav>
      <Dialog as="div" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <Dialog.Panel className="fixed inset-0 z-10 overflow-y-auto bg-wehrli px-6 py-6 lg:hidden">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Wehrli Licht GmbH</span>
              <Image
                src="/logos/wehrli_licht_logo.svg"
                alt="Wehrli Licht Logo"
                width={200}
                height={60}
              />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Menu schliessen</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/25">
              <div className="space-y-2 py-6">
                {navigation.map((item) => {
                  return 'items' in item ? (
                    <NavigationAccordion
                      key={item.title}
                      title={item.title}
                      items={item.items}
                    />
                  ) : (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-white hover:bg-gray-400/10"
                    >
                      {item.name}
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </>
  )
}
