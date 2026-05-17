import { buildCustomerOrderEmail, buildShopOrderEmail } from '@/lib/checkout-order-email';
import { logCheckoutEmailFailure } from '@/lib/checkout-email-log';
import { getResendConfig } from '@/lib/resend';
import { CheckoutOrderEmailData } from '@/types/checkout-order-email';

export type SendCheckoutEmailsResult = {
  ok: boolean;
  skipped?: boolean;
  message?: string;
};

export const isCheckoutEmailDelivered = (result: SendCheckoutEmailsResult): boolean => result.ok && !result.skipped;

export const sendCheckoutOrderEmails = async (order: CheckoutOrderEmailData): Promise<SendCheckoutEmailsResult> => {
  const config = getResendConfig();

  if (!config) {
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
      config.client.emails.send({
        from: config.from,
        to: order.customer.email,
        subject: customerEmail.subject,
        html: customerEmail.html,
        headers: {
          'Idempotency-Key': `${idempotencyPrefix}-customer`,
        },
      }),
      config.client.emails.send({
        from: config.from,
        to: config.shopNotificationEmails,
        replyTo: order.customer.email,
        subject: shopEmail.subject,
        html: shopEmail.html,
        headers: {
          'Idempotency-Key': `${idempotencyPrefix}-shop`,
        },
      }),
    ]);

    if (customerResult.error || shopResult.error) {
      const message = customerResult.error?.message ?? shopResult.error?.message ?? 'E-Mail-Versand fehlgeschlagen.';

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
