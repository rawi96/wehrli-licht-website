'use client';

import { checkoutFieldGroupClass, checkoutInputClass, checkoutLabelClass } from '@/components/shop/checkout-styles';
import { CheckoutCustomer } from '@/types/checkout';

type Props = {
  customer: CheckoutCustomer;
  onCustomerChange: (customer: CheckoutCustomer) => void;
};

export const CheckoutContactFields = ({ customer, onCustomerChange }: Props) => (
  <div className={checkoutFieldGroupClass}>
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="checkout-first-name" className={checkoutLabelClass}>
          Vorname
        </label>
        <input
          id="checkout-first-name"
          name="firstName"
          required
          autoComplete="given-name"
          className={checkoutInputClass}
          value={customer.firstName}
          onChange={(event) => onCustomerChange({ ...customer, firstName: event.target.value })}
        />
      </div>
      <div>
        <label htmlFor="checkout-last-name" className={checkoutLabelClass}>
          Nachname
        </label>
        <input
          id="checkout-last-name"
          name="lastName"
          required
          autoComplete="family-name"
          className={checkoutInputClass}
          value={customer.lastName}
          onChange={(event) => onCustomerChange({ ...customer, lastName: event.target.value })}
        />
      </div>
    </div>

    <div>
      <label htmlFor="checkout-email" className={checkoutLabelClass}>
        E-Mail
      </label>
      <input
        id="checkout-email"
        name="email"
        type="email"
        required
        autoComplete="email"
        className={checkoutInputClass}
        value={customer.email}
        onChange={(event) => onCustomerChange({ ...customer, email: event.target.value })}
      />
    </div>

    <div>
      <label htmlFor="checkout-phone" className={checkoutLabelClass}>
        Telefon
      </label>
      <input
        id="checkout-phone"
        name="phone"
        type="tel"
        required
        autoComplete="tel"
        className={checkoutInputClass}
        value={customer.phone}
        onChange={(event) => onCustomerChange({ ...customer, phone: event.target.value })}
      />
    </div>
  </div>
);
