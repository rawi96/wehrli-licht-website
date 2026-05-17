'use client';

import { useShopContext } from '@/app/context/shop-context';
import { Button } from '@/components/button';
import { CheckoutErrorAlert } from '@/components/shop/checkout-error-alert';
import { CHECKOUT_PAYMENT_LABELS, CHECKOUT_SHIPPING_LABELS, CHECKOUT_SUCCESS_HEADING } from '@/constants/checkout-labels';
import { CheckoutSuccessStatus } from '@/types/checkout-success-status';
import { formatShippingAddress } from '@/utils/checkout-shipping-address';
import { startCheckoutConfetti } from '@/utils/checkout-confetti';
import { clearCheckoutDraft } from '@/utils/checkout-storage';
import { formatPriceToCHF } from '@/utils/price';
import Link from 'next/link';
import { useEffect } from 'react';

type Props = {
  status: CheckoutSuccessStatus;
};

const CheckoutSuccessActions = () => (
  <div className="mt-8 flex flex-wrap gap-3">
    <Button text="Zum Shop" type="primary" href="/shop" showArrow={false} />
    <Button text="Zur Website" type="secondary" href="/" showArrow={false} />
  </div>
);

export const CheckoutSuccess = ({ status }: Props) => {
  const { clearCart } = useShopContext();
  const isComplete = status.kind === 'complete';

  useEffect(() => {
    if (!isComplete) {
      return;
    }

    clearCart();
    clearCheckoutDraft();
  }, [isComplete, clearCart]);

  useEffect(() => {
    if (!isComplete) {
      return;
    }

    return startCheckoutConfetti();
  }, [isComplete]);

  if (status.kind === 'email_failed') {
    return (
      <div className="mx-auto max-w-lg py-12">
        <CheckoutErrorAlert variant="payment_received_no_email" />
        <div className="mt-8">
          <Button text="Zum Shop" type="secondary" href="/shop" showArrow={false} />
        </div>
      </div>
    );
  }

  if (status.kind === 'invalid') {
    return (
      <div className="mx-auto max-w-lg py-12">
        <h1 className="text-2xl font-bold">Bestellung prüfen</h1>
        <p className="mt-4 text-sm text-gray-600">
          Diese Seite ist ungültig oder die Zahlung wurde noch nicht bestätigt. Bitte prüfen Sie Ihre E-Mails oder melden Sie
          sich über unsere{' '}
          <Link href="/kontakt" className="font-bold underline">
            Kontaktseite
          </Link>
          .
        </p>
        <CheckoutSuccessActions />
      </div>
    );
  }

  if (status.channel === 'manual') {
    const { order } = status;

    return (
      <div className="mx-auto max-w-lg py-8">
        <h1 className="text-2xl font-bold">{CHECKOUT_SUCCESS_HEADING}</h1>
        <p className="mt-2 text-sm text-gray-600">
          Bestätigung an{' '}
          <a className="underline" href={`mailto:${order.customer.email}`}>
            {order.customer.email}
          </a>
        </p>

        <dl className="mt-6 space-y-1 border-t border-gray-200 pt-4 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">Nr.</dt>
            <dd className="font-mono text-xs">{order.orderId}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">Zahlung</dt>
            <dd>{CHECKOUT_PAYMENT_LABELS[order.paymentMethod].title}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">Versand</dt>
            <dd>{CHECKOUT_SHIPPING_LABELS[order.shipping]}</dd>
          </div>
          {order.shipping === 'post' && order.shippingAddress && (
            <div>
              <dt className="text-gray-500">Adresse</dt>
              <dd className="mt-1">{formatShippingAddress(order.shippingAddress)}</dd>
            </div>
          )}
          {order.deliveryTimeSummary && (
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">Lieferzeit</dt>
              <dd>{order.deliveryTimeSummary}</dd>
            </div>
          )}
          <div className="flex justify-between gap-4 font-bold">
            <dt>Total</dt>
            <dd>{formatPriceToCHF(order.grandTotalChf)}</dd>
          </div>
          {order.comment && (
            <div>
              <dt className="text-gray-500">Kommentar</dt>
              <dd className="mt-1 whitespace-pre-wrap">{order.comment}</dd>
            </div>
          )}
        </dl>

        {order.paymentMethod === 'cash' && <p className="mt-6 text-sm">Bezahlung bei Abholung in Goldach.</p>}

        <CheckoutSuccessActions />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg py-12">
      <h1 className="text-2xl font-bold">{CHECKOUT_SUCCESS_HEADING}</h1>
      <p className="mt-2 text-sm text-gray-600">Bestätigung per E-Mail wurde versendet.</p>
      <CheckoutSuccessActions />
    </div>
  );
};
