import Link from 'next/link'
import { global } from '../../data/global'
import { websiteNavigationItems } from '../../data/navigationItems'
import { socialItems } from '../../data/socialItems'
import { Address } from '../Address'
import { AnalyticsListener } from '../AnalyticsListener'
import { Flyout } from '../Flyout'
import { OpeningHours } from '../OpeningHours'

export const Footer = () => {
  return (
    <footer className="bg-wehrli text-white">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 pb-10 pt-20 sm:py-24 sm:pb-10 lg:px-8">
        <nav
          className="relative -mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12"
          aria-label="Footer"
        >
          {websiteNavigationItems.map((item) => {
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
                <AnalyticsListener buttonName={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm leading-6 hover:text-gray-900"
                  >
                    {item.name}
                  </Link>
                </AnalyticsListener>
              </div>
            )
          })}
        </nav>
        <div className="mt-10 flex justify-center space-x-10">
          {socialItems.map((item) => (
            <AnalyticsListener key={item.name} buttonName={item.name}>
              <Link href={item.href} className="hover:text-gray-500">
                <span className="sr-only">{item.name}</span>
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </Link>
            </AnalyticsListener>
          ))}
        </div>

        <h3 className="mt-10 text-center text-sm font-bold">
          {global.addressTitle}
        </h3>
        <Address />
        {global.showHolidays && (
          <>
            <h3 className="mt-10 text-center text-sm font-bold">
              Betriebsferien
            </h3>
            <div className="text-center text-sm leading-6">
              {`${global.holidaysStart} - ${global.holidaysEnd}`}
            </div>
          </>
        )}
        <h3 className="mt-10 text-center text-sm font-bold">
          {global.openingHoursTitle}
        </h3>
        <OpeningHours />
      </div>
    </footer>
  )
}
