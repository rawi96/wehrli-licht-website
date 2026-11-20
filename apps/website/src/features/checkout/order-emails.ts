import 'server-only';
import type { CheckoutOrder } from '@/domain/checkout/order';
import { getShopNotificationEmails } from '@/features/mail/recipients';
import { mailer, payments } from '@/integrations';
import { buildCustomerOrderEmail, buildShopOrderEmail } from './email/build-emails';

export type SendCheckoutEmailsResult = {
  ok: boolean;
  skipped?: boolean;
  message?: string;
};

export const isCheckoutEmailDelivered = (result: SendCheckoutEmailsResult): boolean => result.ok && !result.skipped;

export const logCheckoutEmailFailure = (
  context: string,
  technicalError: string | undefined,
  order: Pick<CheckoutOrder, 'orderId' | 'customer' | 'paymentMethod'>,
  extra?: Record<string, unknown>,
): void => {
  console.error('[checkout-email]', {
    context,
    technicalError: technicalError ?? 'Unbekannter Fehler',
    orderId: order.orderId,
    customerEmail: order.customer.email,
    paymentMethod: order.paymentMethod,
    ...extra,
  });
};

/** Sends the confirmation to the customer and the notification to the shop. */
export const sendCheckoutOrderEmails = async (order: CheckoutOrder): Promise<SendCheckoutEmailsResult> => {
  const shopNotificationEmails = getShopNotificationEmails();

  if (!mailer.isConfigured() || shopNotificationEmails.length === 0) {
    const technicalError =
      'E-Mail-Versand nicht konfiguriert (RESEND_API_KEY, RESEND_FROM_EMAIL, SHOP_ORDER_NOTIFICATION_EMAIL[_2])';

    logCheckoutEmailFailure('sendCheckoutOrderEmails', technicalError, order);

    return {
      ok: true,
      skipped: true,
      message: technicalError,
    };
  }

  const customerEmail = buildCustomerOrderEmail(order);
  const shopEmail = buildShopOrderEmail(order);
  const idempotencyPrefix = `checkout-${order.orderId}`;

  try {
    const [customerResult, shopResult] = await Promise.all([
      mailer.send({
        to: order.customer.email,
        subject: customerEmail.subject,
        html: customerEmail.html,
        idempotencyKey: `${idempotencyPrefix}-customer`,
      }),
      mailer.send({
        to: shopNotificationEmails,
        replyTo: order.customer.email,
        subject: shopEmail.subject,
        html: shopEmail.html,
        idempotencyKey: `${idempotencyPrefix}-shop`,
      }),
    ]);

    if (!customerResult.ok || !shopResult.ok) {
      const message =
        (!customerResult.ok ? customerResult.error : undefined) ??
        (!shopResult.ok ? shopResult.error : undefined) ??
        'E-Mail-Versand fehlgeschlagen.';

      logCheckoutEmailFailure('sendCheckoutOrderEmails', message, order, {
        customerResult,
        shopResult,
      });

      return { ok: false, message };
    }

    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'E-Mail-Versand fehlgeschlagen.';

    logCheckoutEmailFailure('sendCheckoutOrderEmails', message, order, {
      error,
    });

    return { ok: false, message };
  }
};

/** The e-mails of a paid online order, loaded from the payment provider. */
export const sendPaidOrderEmails = async (sessionId: string): Promise<SendCheckoutEmailsResult> => {
  try {
    const order = await payments.getPaidOrder(sessionId);

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
