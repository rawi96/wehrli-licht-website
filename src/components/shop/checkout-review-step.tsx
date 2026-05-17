'use client';

import { Button } from '@/components/button';
import { CHECKOUT_PAYMENT_LABELS, CHECKOUT_SHIPPING_LABELS } from '@/constants/checkout-labels';
import { CheckoutCustomer, CheckoutPaymentMethod, CheckoutShippingAddress, CheckoutShippingMethod } from '@/types/checkout';
import { checkoutInlineErrorClass } from '@/components/shop/checkout-styles';
import { formatShippingAddress } from '@/utils/checkout-shipping-address';
import { formatShippingCostLabel } from '@/utils/product-commerce';
import { formatPriceToCHF } from '@/utils/price';

type CartLine = {
  id: string;
  name: string;
  quantity: number;
  unitPriceChf: number;
  selectionsLabel?: string;
};

type Props = {
  customer: CheckoutCustomer;
  shipping: CheckoutShippingMethod;
  shippingAddress: CheckoutShippingAddress;
  paymentMethod: CheckoutPaymentMethod;
  comment: string;
  cartLines: CartLine[];
  subTotalChf: number;
  shippingCostChf: number;
  grandTotalChf: number;
  deliveryTimeSummary?: string;
  error: string | null;
  isQuoteLoading: boolean;
  isSubmitting: boolean;
  onBack: () => void;
  onSubmit: () => void;
};

export const CheckoutReviewStep = ({
  customer,
  shipping,
  shippingAddress,
  paymentMethod,
  comment,
  cartLines,
  subTotalChf,
  shippingCostChf,
  grandTotalChf,
  deliveryTimeSummary,
  error,
  isQuoteLoading,
  isSubmitting,
  onBack,
  onSubmit,
}: Props) => {
  const submitLabel = paymentMethod === 'online' ? 'Jetzt bezahlen' : 'Bestellung abschliessen';

  return (
    <div className="space-y-8">
      <p className="text-sm text-gray-600">
        Bitte prüfen Sie Ihre Angaben. Mit «{submitLabel}» wird die Bestellung verbindlich ausgelöst.
      </p>

      <section className="space-y-3">
        <h2 className="text-sm font-bold">Kontakt</h2>
        <dl className="space-y-1 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">Name</dt>
            <dd className="text-right">
              {customer.firstName} {customer.lastName}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">E-Mail</dt>
            <dd className="text-right">{customer.email}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">Telefon</dt>
            <dd className="text-right">{customer.phone}</dd>
          </div>
        </dl>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-bold">Versand</h2>
        <p className="text-sm">{CHECKOUT_SHIPPING_LABELS[shipping]}</p>
        {shipping === 'post' && <p className="text-sm text-gray-600">{formatShippingAddress(shippingAddress)}</p>}
        {deliveryTimeSummary && <p className="text-sm text-gray-600">Lieferzeit: {deliveryTimeSummary}</p>}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-bold">Zahlung</h2>
        <p className="text-sm font-bold">{CHECKOUT_PAYMENT_LABELS[paymentMethod].title}</p>
        <p className="text-sm text-gray-600">{CHECKOUT_PAYMENT_LABELS[paymentMethod].description}</p>
      </section>

      {comment.trim() && (
        <section className="space-y-3">
          <h2 className="text-sm font-bold">Kommentar</h2>
          <p className="text-sm whitespace-pre-wrap text-gray-600">{comment.trim()}</p>
        </section>
      )}

      <section className="space-y-3 border-t border-gray-200 pt-6">
        <h2 className="text-sm font-bold">Artikel</h2>
        {isQuoteLoading && <p className="text-sm text-gray-500">Warenkorb wird geprüft…</p>}
        <ul className="space-y-3 text-sm">
          {!isQuoteLoading &&
            cartLines.map((line) => (
              <li key={line.id} className="flex justify-between gap-4">
                <span>
                  {line.quantity}× {line.name}
                  {line.selectionsLabel && <span className="block text-gray-500">{line.selectionsLabel}</span>}
                </span>
                <span className="shrink-0">{formatPriceToCHF(line.unitPriceChf * line.quantity)}</span>
              </li>
            ))}
        </ul>
        <dl className="space-y-1 border-t border-gray-100 pt-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">Zwischentotal</dt>
            <dd>{formatPriceToCHF(subTotalChf)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">Versand</dt>
            <dd>{formatShippingCostLabel(shipping, shippingCostChf)}</dd>
          </div>
          <div className="flex justify-between gap-4 font-bold">
            <dt>Total</dt>
            <dd>{formatPriceToCHF(grandTotalChf)}</dd>
          </div>
        </dl>
      </section>

      {error && <p className={checkoutInlineErrorClass}>{error}</p>}

      <div className="flex justify-between gap-4">
        <Button type="secondary" text="Zurück" showArrow={false} onClick={onBack} />
        <Button
          type="primary"
          text={submitLabel}
          onClick={onSubmit}
          loading={isSubmitting}
          disabled={isQuoteLoading || cartLines.length === 0}
        />
      </div>
    </div>
  );
};
