import { CheckoutShippingAddress } from '@/types/checkout';

export const CHECKOUT_SHIPPING_COUNTRY = 'CH' as const;

export const CHECKOUT_SHIPPING_COUNTRY_LABEL = 'Schweiz';

export const emptyShippingAddress = (): CheckoutShippingAddress => ({
  street: '',
  postalCode: '',
  city: '',
  country: CHECKOUT_SHIPPING_COUNTRY,
});

export const validateShippingAddress = (address: CheckoutShippingAddress): string | null => {
  if (!address.street.trim()) {
    return 'Bitte Strasse und Hausnummer angeben.';
  }

  if (!/^\d{4}$/.test(address.postalCode.trim())) {
    return 'Bitte eine gültige Schweizer PLZ (4 Ziffern) angeben.';
  }

  if (!address.city.trim()) {
    return 'Bitte den Ort angeben.';
  }

  if (address.country !== CHECKOUT_SHIPPING_COUNTRY) {
    return 'Lieferung ist nur innerhalb der Schweiz möglich.';
  }

  return null;
};

export const formatShippingAddress = (address: CheckoutShippingAddress): string =>
  `${address.street.trim()}, ${address.postalCode.trim()} ${address.city.trim()}, Schweiz`;
