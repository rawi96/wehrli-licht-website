import { getSiteUrl } from '@/utils/site-url';

export const CHECKOUT_EMAIL_BRAND = {
  primary: '#214073',
  primaryMuted: '#4577CA',
  surface: '#f0f4fa',
} as const;

export const getCheckoutEmailSiteUrl = (): string => getSiteUrl();

export const getCheckoutEmailLogoUrl = (): string => `${getCheckoutEmailSiteUrl()}/wehrli-licht-logo.svg`;
