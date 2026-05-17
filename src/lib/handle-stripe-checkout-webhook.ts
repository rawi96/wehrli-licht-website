import { logCheckoutEmailFailure } from '@/lib/checkout-email-log';
import { sendStripeCheckoutOrderEmails } from '@/lib/send-stripe-checkout-order-emails';
import { isCheckoutEmailDelivered } from '@/lib/send-checkout-order-emails';
import type Stripe from 'stripe';

export const SHOP_CHECKOUT_SOURCE = 'shop';

export type StripeCheckoutWebhookResult = { status: 'ignored' } | { status: 'sent' } | { status: 'failed'; message: string };

export const handleStripeCheckoutWebhookEvent = async (event: Stripe.Event): Promise<StripeCheckoutWebhookResult> => {
  if (event.type !== 'checkout.session.completed') {
    return { status: 'ignored' };
  }

  const session = event.data.object;

  if (session.metadata?.source !== SHOP_CHECKOUT_SOURCE) {
    return { status: 'ignored' };
  }

  const sessionId = session.id;

  if (!sessionId) {
    return { status: 'failed', message: 'Stripe session id missing' };
  }

  const emailResult = await sendStripeCheckoutOrderEmails(sessionId);

  if (!isCheckoutEmailDelivered(emailResult)) {
    const message = emailResult.message ?? 'E-Mail-Versand fehlgeschlagen.';

    logCheckoutEmailFailure(
      'stripe webhook',
      message,
      {
        orderId: session.metadata?.order_id ?? sessionId,
        customer: {
          firstName: '',
          lastName: '',
          email: session.customer_email ?? session.metadata?.customer_email ?? '',
          phone: session.metadata?.customer_phone ?? '',
        },
        paymentMethod: 'online',
      },
      { sessionId, skipped: emailResult.skipped },
    );

    return { status: 'failed', message };
  }

  return { status: 'sent' };
};
