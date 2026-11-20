import 'server-only';
import type { PaymentWebhookEvent } from '@/ports/payment-provider';
import { SHOP_CHECKOUT_SOURCE } from './checkout-session';
import { getStripe, getStripeWebhookSecret } from './client';

/** Verifies the Stripe signature and maps `checkout.session.completed` of shop sessions to a domain event. */
export const parseStripeWebhook = async (body: string, headers: Headers): Promise<PaymentWebhookEvent> => {
  const signature = headers.get('stripe-signature');

  if (!signature) {
    throw new Error('Missing stripe-signature header');
  }

  const event = await getStripe().webhooks.constructEventAsync(body, signature, getStripeWebhookSecret());

  if (event.type !== 'checkout.session.completed') {
    return { type: 'ignored' };
  }

  const session = event.data.object;

  if (session.metadata?.source !== SHOP_CHECKOUT_SOURCE) {
    return { type: 'ignored' };
  }

  return {
    type: 'checkout_completed',
    sessionId: session.id ?? '',
    orderId: session.metadata?.order_id ?? session.id,
    customerEmail: session.customer_email ?? session.metadata?.customer_email ?? '',
    customerPhone: session.metadata?.customer_phone ?? '',
  };
};
