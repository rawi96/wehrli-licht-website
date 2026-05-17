import { Resend } from 'resend';

export type ResendConfig = {
  client: Resend;
  from: string;
  shopNotificationEmails: string[];
};

const parseEmailList = (value: string | undefined): string[] => {
  if (!value?.trim()) {
    return [];
  }

  return value
    .split(',')
    .map((email) => email.trim())
    .filter(Boolean);
};

export const getShopNotificationEmails = (): string[] => {
  const emails = [
    ...parseEmailList(process.env.SHOP_ORDER_NOTIFICATION_EMAIL),
    ...parseEmailList(process.env.SHOP_ORDER_NOTIFICATION_EMAIL_2),
  ];

  return [...new Set(emails)];
};

export const getResendConfig = (): ResendConfig | null => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const shopNotificationEmails = getShopNotificationEmails();

  if (!apiKey || !from || shopNotificationEmails.length === 0) {
    return null;
  }

  return {
    client: new Resend(apiKey),
    from,
    shopNotificationEmails,
  };
};
