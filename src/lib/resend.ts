import { Resend } from 'resend';

export type ResendConfig = {
  client: Resend;
  from: string;
  shopNotificationEmail: string;
};

export function getResendConfig(): ResendConfig | null {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const shopNotificationEmail = process.env.SHOP_ORDER_NOTIFICATION_EMAIL;

  if (!apiKey || !from || !shopNotificationEmail) {
    return null;
  }

  return {
    client: new Resend(apiKey),
    from,
    shopNotificationEmail,
  };
}
