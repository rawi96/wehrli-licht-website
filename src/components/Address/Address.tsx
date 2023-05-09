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
          href="https://www.google.com/maps/place/{global.address.street}"
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
            className="block p-1 underline hover:opacity-80"
            href={`tel:${global.address.tel}`}
            itemProp="telephone"
          >
            {global.address.tel}
          </Link>
          <Link
            className="block p-1 underline hover:opacity-80"
            href={`mailto:${global.address.email}`}
            itemProp="email"
          >
            {global.address.email}
          </Link>
        </p>
      </span>
    </address>
  )
}
