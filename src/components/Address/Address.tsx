import Link from 'next/link'
import { global } from '../../data/global'
import { AddressProps } from './types'

export const Address = ({ size = 's' }: AddressProps) => {
  return (
    <address
      className={`${
        size === 's' ? 'text-sm' : 'leading-6'
      } text-center not-italic`}
      itemScope
      itemType="https://schema.org/Organization"
    >
      <span className="inline-block">
        <Link
          href={global.address.maps}
          target="_blank"
          itemProp="address"
          itemScope
          itemType="https://schema.org/PostalAddress"
          className="hover:opacity-80"
        >
          <p itemProp="name">{global.name}</p>
          <p itemProp="streetAddress">{global.address.street}</p>
          <span itemProp="postalCode">{global.address.zip}</span>{' '}
          <span itemProp="addressLocality">{global.address.place}</span>
        </Link>
        <p className="mt-4">
          <Link
            className="block p-4 underline hover:opacity-80"
            href={`tel:${global.address.tel}`}
            itemProp="telephone"
          >
            <button className="relative inline-flex items-center border px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 lg:px-6">
              {global.address.tel}
            </button>
          </Link>
          <Link
            className="block p-4 underline hover:opacity-80"
            href={`mailto:${global.address.email}`}
            itemProp="email"
          >
            <button className="relative inline-flex items-center border px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 lg:px-6">
              {global.address.email}
            </button>
          </Link>
        </p>
      </span>
    </address>
  )
}
