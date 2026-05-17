'use client';

import { checkoutFieldGroupClass, checkoutInputClass, checkoutLabelClass } from '@/components/shop/checkout-styles';
import { CheckoutShippingAddress } from '@/types/checkout';
import { CHECKOUT_SHIPPING_COUNTRY, CHECKOUT_SHIPPING_COUNTRY_LABEL } from '@/utils/checkout-shipping-address';
import { Popover } from '@headlessui/react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

type Props = {
  address: CheckoutShippingAddress;
  onChange: (address: CheckoutShippingAddress) => void;
};

export const CheckoutShippingAddressForm = ({ address, onChange }: Props) => (
  <div className={checkoutFieldGroupClass}>
    <div>
      <label htmlFor="checkout-shipping-street" className={checkoutLabelClass}>
        Strasse
      </label>
      <input
        id="checkout-shipping-street"
        name="shippingStreet"
        required
        autoComplete="street-address"
        className={checkoutInputClass}
        value={address.street}
        onChange={(event) => onChange({ ...address, street: event.target.value })}
      />
    </div>

    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="checkout-shipping-postal-code" className={checkoutLabelClass}>
          PLZ
        </label>
        <input
          id="checkout-shipping-postal-code"
          name="shippingPostalCode"
          required
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={4}
          className={checkoutInputClass}
          value={address.postalCode}
          onChange={(event) => onChange({ ...address, postalCode: event.target.value.replace(/\D/g, '').slice(0, 4) })}
        />
      </div>
      <div>
        <label htmlFor="checkout-shipping-city" className={checkoutLabelClass}>
          Ort
        </label>
        <input
          id="checkout-shipping-city"
          name="shippingCity"
          required
          autoComplete="address-level2"
          className={checkoutInputClass}
          value={address.city}
          onChange={(event) => onChange({ ...address, city: event.target.value })}
        />
      </div>
    </div>

    <div>
      <div className="mb-1 flex items-center gap-1.5">
        <label htmlFor="checkout-shipping-country" className="text-sm">
          Land
        </label>
        <Popover className="relative">
          <Popover.Button
            type="button"
            className="focus-visible:ring-wehrli rounded text-gray-400 hover:text-gray-600 focus:outline-none focus-visible:ring-1"
            aria-label="Hinweis zu Lieferländern"
          >
            <InformationCircleIcon className="size-4" aria-hidden />
          </Popover.Button>
          <Popover.Panel className="absolute top-full left-0 z-20 mt-1 w-64 rounded border border-gray-200 bg-white p-3 text-sm text-gray-600 shadow-lg">
            Für Lieferung in andere Länder{' '}
            <Link href="/kontakt" className="text-wehrli font-bold underline">
              kontaktieren
            </Link>{' '}
            Sie uns bitte.
          </Popover.Panel>
        </Popover>
      </div>
      <input
        id="checkout-shipping-country"
        name="shippingCountry"
        readOnly
        aria-readonly="true"
        className={`${checkoutInputClass} cursor-default bg-gray-50 text-gray-700`}
        value={CHECKOUT_SHIPPING_COUNTRY_LABEL}
      />
      <input type="hidden" name="shippingCountryCode" value={CHECKOUT_SHIPPING_COUNTRY} />
    </div>
  </div>
);
