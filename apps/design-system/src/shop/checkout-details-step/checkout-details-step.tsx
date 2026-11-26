'use client';

import { Popover } from '@headlessui/react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { FC, FormEvent } from 'react';
import { FormError, Label, Textarea, TextInput } from '../../forms/field/field';
import { CheckoutActions } from '../checkout-actions/checkout-actions';

export type CheckoutContact = { firstName: string; lastName: string; email: string; phone: string };
export type CheckoutAddress = { street: string; postalCode: string; city: string };

type Props = {
  contact: CheckoutContact;
  onContactChange: (contact: CheckoutContact) => void;
  /** Shipping address fields, for shipping by post. */
  showAddress?: boolean;
  address: CheckoutAddress;
  /** Called with the raw input; the caller cleans values (e.g. digits only in the postal code). */
  onAddressChange: (address: CheckoutAddress) => void;
  /** The only delivery country, shown read-only. */
  country: { code: string; label: string };
  /** Contact page, linked from the hint on other delivery countries. */
  contactHref: string;
  comment: string;
  onCommentChange: (comment: string) => void;
  error?: string | null;
  onBack: () => void;
  /** The form is submitted with the next button; the caller validates it. */
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  labels?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    street: string;
    postalCode: string;
    city: string;
    country: string;
    countryHint: string;
    countryHintBefore: string;
    countryHintLink: string;
    countryHintAfter: string;
    comment: string;
    continue: string;
  };
};

const DEFAULT_LABELS = {
  firstName: 'Vorname',
  lastName: 'Nachname',
  email: 'E-Mail',
  phone: 'Telefon',
  street: 'Strasse',
  postalCode: 'PLZ',
  city: 'Ort',
  country: 'Land',
  countryHint: 'Hinweis zu Lieferländern',
  countryHintBefore: 'Für Lieferung in andere Länder',
  countryHintLink: 'kontaktieren',
  countryHintAfter: 'Sie uns bitte.',
  comment: 'Kommentar',
  continue: 'Weiter',
};

/** Checkout step 2: contact details, the shipping address (by post) and a comment. */
export const CheckoutDetailsStep: FC<Props> = ({
  contact,
  onContactChange,
  showAddress,
  address,
  onAddressChange,
  country,
  contactHref,
  comment,
  onCommentChange,
  error,
  onBack,
  onSubmit,
  labels = DEFAULT_LABELS,
}) => (
  <form onSubmit={onSubmit} className="space-y-6">
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="checkout-first-name">{labels.firstName}</Label>
          <TextInput
            id="checkout-first-name"
            name="firstName"
            required
            autoComplete="given-name"
            value={contact.firstName}
            onChange={(firstName) => onContactChange({ ...contact, firstName })}
          />
        </div>
        <div>
          <Label htmlFor="checkout-last-name">{labels.lastName}</Label>
          <TextInput
            id="checkout-last-name"
            name="lastName"
            required
            autoComplete="family-name"
            value={contact.lastName}
            onChange={(lastName) => onContactChange({ ...contact, lastName })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="checkout-email">{labels.email}</Label>
        <TextInput
          id="checkout-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={contact.email}
          onChange={(email) => onContactChange({ ...contact, email })}
        />
      </div>

      <div>
        <Label htmlFor="checkout-phone">{labels.phone}</Label>
        <TextInput
          id="checkout-phone"
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          value={contact.phone}
          onChange={(phone) => onContactChange({ ...contact, phone })}
        />
      </div>
    </div>

    {showAddress && (
      <div className="space-y-4">
        <div>
          <Label htmlFor="checkout-shipping-street">{labels.street}</Label>
          <TextInput
            id="checkout-shipping-street"
            name="shippingStreet"
            required
            autoComplete="street-address"
            value={address.street}
            onChange={(street) => onAddressChange({ ...address, street })}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="checkout-shipping-postal-code">{labels.postalCode}</Label>
            <TextInput
              id="checkout-shipping-postal-code"
              name="shippingPostalCode"
              required
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={4}
              value={address.postalCode}
              onChange={(postalCode) => onAddressChange({ ...address, postalCode })}
            />
          </div>
          <div>
            <Label htmlFor="checkout-shipping-city">{labels.city}</Label>
            <TextInput
              id="checkout-shipping-city"
              name="shippingCity"
              required
              autoComplete="address-level2"
              value={address.city}
              onChange={(city) => onAddressChange({ ...address, city })}
            />
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-center gap-1.5">
            <label htmlFor="checkout-shipping-country" className="text-sm">
              {labels.country}
            </label>
            <Popover className="relative">
              <Popover.Button
                type="button"
                className="rounded-md text-gray-400 hover:text-gray-600"
                aria-label={labels.countryHint}
              >
                <InformationCircleIcon className="size-4" aria-hidden />
              </Popover.Button>
              <Popover.Panel className="absolute top-full left-0 z-20 mt-1 w-64 rounded-md border border-gray-200 bg-white p-3 text-sm text-gray-600 shadow-lg">
                {labels.countryHintBefore}{' '}
                <Link href={contactHref} className="text-wehrli font-bold underline">
                  {labels.countryHintLink}
                </Link>{' '}
                {labels.countryHintAfter}
              </Popover.Panel>
            </Popover>
          </div>
          <TextInput id="checkout-shipping-country" name="shippingCountry" value={country.label} readOnly />
          <input type="hidden" name="shippingCountryCode" value={country.code} />
        </div>
      </div>
    )}

    <div>
      <Label htmlFor="checkout-comment">{labels.comment}</Label>
      <Textarea id="checkout-comment" name="comment" rows={2} value={comment} onChange={onCommentChange} />
    </div>

    {error && <FormError>{error}</FormError>}
    <CheckoutActions onBack={onBack} nextLabel={labels.continue} nextType="submit" />
  </form>
);
