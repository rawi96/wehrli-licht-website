import { loadCheckoutOrderEmailDataFromStripe } from '@/lib/checkout-order-from-stripe';
import { sendCheckoutOrderEmails, SendCheckoutEmailsResult } from '@/lib/send-checkout-order-emails';

export const sendStripeCheckoutOrderEmails = async (sessionId: string): Promise<SendCheckoutEmailsResult> => {
  try {
    const order = await loadCheckoutOrderEmailDataFromStripe(sessionId);

    if (!order) {
      return { ok: false, message: 'Zahlung nicht abgeschlossen oder Bestelldaten unvollständig.' };
    }

    return sendCheckoutOrderEmails(order);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Stripe-Session konnte nicht geladen werden.';

    console.error('[checkout-email] stripe', message);

    return { ok: false, message };
  }
};
