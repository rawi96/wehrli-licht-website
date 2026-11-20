const parseEmailList = (value: string | undefined): string[] => {
  if (!value?.trim()) {
    return [];
  }

  return value
    .split(',')
    .map((email) => email.trim())
    .filter(Boolean);
};

/** Who gets new shop orders (SHOP_ORDER_NOTIFICATION_EMAIL[_2], comma-separated). */
export const getShopNotificationEmails = (): string[] => {
  const emails = [
    ...parseEmailList(process.env.SHOP_ORDER_NOTIFICATION_EMAIL),
    ...parseEmailList(process.env.SHOP_ORDER_NOTIFICATION_EMAIL_2),
  ];

  return [...new Set(emails)];
};

/** Who gets contact requests (CONTACT_FORM_EMAIL, comma-separated), falling back to the shop's recipients. */
export const getContactRecipients = (): string[] => {
  const contactEmails = parseEmailList(process.env.CONTACT_FORM_EMAIL);

  return contactEmails.length > 0 ? contactEmails : getShopNotificationEmails();
};
