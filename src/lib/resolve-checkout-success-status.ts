import { sendStripeCheckoutOrderEmails } from '@/actions/checkout-emails';
import { STRIPE_SHIPPING_LINE_NAME } from '@/constants/checkout-labels';
import { isCheckoutEmailDelivered } from '@/lib/send-checkout-order-emails';
import { getStripe } from '@/lib/stripe';
import { CheckoutPurchase, CheckoutSuccessStatus } from '@/types/checkout-success-status';
import type Stripe from 'stripe';
import { verifyCheckoutOrderToken } from '@/utils/checkout-order-token';

const purchaseFromStripeSession = (session: Stripe.Checkout.Session): CheckoutPurchase => ({
  transactionId: session.id,
  valueChf: (session.amount_total ?? 0) / 100,
  items: (session.line_items?.data ?? [])
    .filter((line) => line.description !== STRIPE_SHIPPING_LINE_NAME)
    .map((line) => ({
      name: line.description ?? 'Artikel',
      quantity: line.quantity ?? 1,
      priceChf: (line.price?.unit_amount ?? 0) / 100,
    })),
});

export const resolveCheckoutSuccessStatus = async (
  sessionId: string | undefined,
  orderToken: string | undefined,
): Promise<CheckoutSuccessStatus> => {
  const manualOrder = orderToken ? verifyCheckoutOrderToken(orderToken) : null;

  if (manualOrder) {
    return {
      kind: 'complete',
      channel: 'manual',
      order: manualOrder,
      purchase: {
        transactionId: manualOrder.orderId,
        valueChf: manualOrder.grandTotalChf,
        items: manualOrder.items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          priceChf: item.unitPriceChf,
        })),
      },
    };
  }

  if (!sessionId) {
    return { kind: 'invalid' };
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['line_items'] });
    const stripePaymentVerified = session.payment_status === 'paid';

    if (!stripePaymentVerified) {
      return { kind: 'invalid' };
    }

    const emailResult = await sendStripeCheckoutOrderEmails(sessionId);

    if (!isCheckoutEmailDelivered(emailResult)) {
      console.error('[checkout-email]', {
        context: 'stripe checkout success page',
        sessionId,
        technicalError: emailResult.message,
        skipped: emailResult.skipped,
      });

      return {
        kind: 'email_failed',
        channel: 'stripe',
        purchase: purchaseFromStripeSession(session),
      };
    }

    return { kind: 'complete', channel: 'stripe', purchase: purchaseFromStripeSession(session) };
  } catch {
    return { kind: 'invalid' };
  }
};
