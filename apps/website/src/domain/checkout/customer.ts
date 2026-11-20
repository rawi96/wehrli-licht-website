import type { CheckoutCustomer } from './order';

export const emptyCheckoutCustomer = (): CheckoutCustomer => ({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
});

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
