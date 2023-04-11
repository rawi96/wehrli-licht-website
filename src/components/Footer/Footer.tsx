import Link from 'next/link'
import { socialItems } from '../../data/socialItems'
import { Flyout } from '../Flyout'
import { navigationItems } from '../../data/navigationItems'

export const Footer = () => {
  return (
    <footer className="bg-wehrli text-white">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 pb-10 pt-20 sm:py-24 sm:pb-10 lg:px-8">
        <nav
          className="relative -mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12"
          aria-label="Footer"
        >
          {navigationItems.map((item) => {
            return 'items' in item ? (
              <div key={item.title} className="pb-6">
                <Flyout
                  key={item.title}
                  title={item.title}
                  items={item.items}
                />
              </div>
            ) : (
              <div key={item.name} className="pb-6">
                <Link
                  href={item.href}
                  className="text-sm leading-6 hover:text-gray-900"
                >
                  {item.name}
                </Link>
              </div>
            )
          })}
        </nav>
        <div className="mt-10 flex justify-center space-x-10">
          {socialItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="hover:text-gray-500"
            >
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </Link>
          ))}
        </div>

        <p className="mt-10 text-center text-xs font-bold leading-5">
          Wehrli Licht GmbH
        </p>

        <p className="text-center text-xs leading-5">
          Blumenstrasse 66 <br />
          9403 Goldach <br />
          +41 71 841 23 68 <br />
          info@wehrli-licht.ch
        </p>

        <p className="mt-10 text-center text-xs font-bold leading-5">
          Öffnungszeiten
        </p>

        <p className="text-center text-xs leading-5">
          Montag – Samstag: 09.00 – 12.00 & 14.00 – 18.00 <br />
          Mittwoch- & Samstagnachmittag geschlossen
        </p>
      </div>
    </footer>
  )
}
