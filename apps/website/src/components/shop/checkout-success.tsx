'use client';

import { useShopContext } from '@/app/context/shop-context';
import { CHECKOUT_ERROR_ALERT_COPY } from '@/constants/checkout-errors';
import { SHOP_HOME_PATH } from '@/constants/shop-paths';
import { trackPurchaseOnce } from '@/lib/analytics/purchase';
import { CHECKOUT_PAYMENT_LABELS, CHECKOUT_SHIPPING_LABELS } from '@/constants/checkout-labels';
import { CheckoutSuccessStatus } from '@/types/checkout-success-status';
import { formatShippingAddress } from '@/utils/checkout-shipping-address';
import { startCheckoutConfetti } from '@/utils/checkout-confetti';
import { clearCheckoutDraft } from '@/utils/checkout-storage';
import { formatPriceToCHF } from '@/utils/price';
import { CheckoutSuccess as CheckoutSuccessView } from '@wehrli/design-system';
import { ComponentProps, useEffect } from 'react';

type Props = {
  status: CheckoutSuccessStatus;
  /** Contact page from DatoCMS (Header & Footer). */
  contactHref: string;
};

const toViewStatus = (status: CheckoutSuccessStatus): ComponentProps<typeof CheckoutSuccessView>['status'] => {
  if (status.kind === 'invalid') {
    return { kind: 'invalid' };
  }

  if (status.kind === 'email_failed') {
    return { kind: 'emailFailed', message: CHECKOUT_ERROR_ALERT_COPY.payment_received_no_email };
  }

  if (status.channel === 'stripe') {
    return { kind: 'paid' };
  }

  const { order } = status;

  return {
    kind: 'ordered',
    order: {
      email: order.customer.email,
      number: order.orderId,
      payment: CHECKOUT_PAYMENT_LABELS[order.paymentMethod].title,
      shipping: CHECKOUT_SHIPPING_LABELS[order.shipping],
      address: order.shipping === 'post' && order.shippingAddress ? formatShippingAddress(order.shippingAddress) : null,
      deliveryTime: order.deliveryTimeSummary,
      total: formatPriceToCHF(order.grandTotalChf),
      comment: order.comment,
      note: order.paymentMethod === 'cash' ? 'Bezahlung bei Abholung in Goldach.' : null,
    },
  };
};

export const CheckoutSuccess = ({ status, contactHref }: Props) => {
  const { clearCart } = useShopContext();
  const isComplete = status.kind === 'complete';

  useEffect(() => {
    if (!isComplete) {
      return;
    }

    clearCart();
    clearCheckoutDraft();
  }, [isComplete, clearCart]);

  const purchase = status.kind === 'invalid' ? null : status.purchase;

  useEffect(() => {
    if (purchase) {
      trackPurchaseOnce(purchase);
    }
  }, [purchase]);

  useEffect(() => {
    if (!isComplete) {
      return;
    }

    return startCheckoutConfetti();
  }, [isComplete]);

  return (
    <CheckoutSuccessView status={toViewStatus(status)} shopHref={SHOP_HOME_PATH} websiteHref="/" contactHref={contactHref} />
  );
};
