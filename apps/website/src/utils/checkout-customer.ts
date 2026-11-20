import { CheckoutCustomer } from '@/types/checkout';

export const validateCheckoutCustomer = (customer: CheckoutCustomer): string | null => {
  if (!customer.firstName.trim() || !customer.lastName.trim()) {
    return 'Bitte Vor- und Nachname angeben.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())) {
    return 'Bitte eine gültige E-Mail-Adresse angeben.';
  }

  if (!customer.phone.trim()) {
    return 'Bitte eine Telefonnummer angeben.';
  }

  return null;
};
