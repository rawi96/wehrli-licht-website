import { sendStripeCheckoutOrderEmails } from '@/actions/checkout-emails';
import { isCheckoutEmailDelivered } from '@/lib/send-checkout-order-emails';
import { getStripe } from '@/lib/stripe';
import { CheckoutSuccessStatus } from '@/types/checkout-success-status';
import { verifyCheckoutOrderToken } from '@/utils/checkout-order-token';

export const resolveCheckoutSuccessStatus = async (
  sessionId: string | undefined,
  orderToken: string | undefined,
): Promise<CheckoutSuccessStatus> => {
  const manualOrder = orderToken ? verifyCheckoutOrderToken(orderToken) : null;

  if (manualOrder) {
    return { kind: 'complete', channel: 'manual', order: manualOrder };
  }

  if (!sessionId) {
    return { kind: 'invalid' };
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
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
      };
    }

    return { kind: 'complete', channel: 'stripe' };
  } catch {
    return { kind: 'invalid' };
  }
};
