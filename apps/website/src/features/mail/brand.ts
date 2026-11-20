import { getSiteUrl } from '@/utils/site-url';

/** Brand colours and links of the shop's and contact form's e-mails. */
export const EMAIL_BRAND = {
  primary: '#214073',
  primaryMuted: '#4577CA',
  surface: '#f0f4fa',
} as const;

export const getEmailSiteUrl = (): string => getSiteUrl();

export const getEmailLogoUrl = (): string => `${getEmailSiteUrl()}/wehrli-licht-logo.svg`;
