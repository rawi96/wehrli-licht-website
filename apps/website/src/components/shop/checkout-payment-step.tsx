'use client';

import { Button } from '@/components/button';
import { checkoutInlineErrorClass, checkoutRadioCardClass } from '@/components/shop/checkout-styles';
import { CHECKOUT_PAYMENT_LABELS } from '@/constants/checkout-labels';
import { CheckoutPaymentMethod } from '@/types/checkout';

type CheckoutPaymentStepProps = {
  paymentMethod: CheckoutPaymentMethod;
  error: string | null;
  onPaymentMethodChange: (method: CheckoutPaymentMethod) => void;
  onBack: () => void;
  onContinue: () => void;
};

const paymentMethods = Object.keys(CHECKOUT_PAYMENT_LABELS) as CheckoutPaymentMethod[];

export const CheckoutPaymentStep = ({
  paymentMethod,
  error,
  onPaymentMethodChange,
  onBack,
  onContinue,
}: CheckoutPaymentStepProps) => (
  <div className="space-y-6">
    <fieldset className="space-y-3">
      <legend className="sr-only">Zahlungsart</legend>
      {paymentMethods.map((method) => (
        <label key={method} className={checkoutRadioCardClass}>
          <input
            type="radio"
            name="payment"
            value={method}
            checked={paymentMethod === method}
            onChange={() => onPaymentMethodChange(method)}
            className="text-wehrli mt-1"
          />
          <span className="text-left">
            <span className="block font-bold">{CHECKOUT_PAYMENT_LABELS[method].title}</span>
            <span className="text-sm text-gray-600">{CHECKOUT_PAYMENT_LABELS[method].description}</span>
          </span>
        </label>
      ))}
    </fieldset>

    {error && <p className={checkoutInlineErrorClass}>{error}</p>}
    <div className="flex justify-between gap-4">
      <Button type="secondary" text="Zurück" showArrow={false} onClick={onBack} />
      <Button type="primary" text="Weiter zur Zusammenfassung" onClick={onContinue} />
    </div>
  </div>
);
