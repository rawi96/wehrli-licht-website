import { getSiteUrl } from '@/utils/site-url';

/** Wehrli brand blue – matches `tailwind.config.ts` → `wehrli.DEFAULT` */
export const CHECKOUT_EMAIL_BRAND = {
  primary: '#214073',
  primaryMuted: '#4577CA',
  surface: '#f0f4fa',
} as const;

export function getCheckoutEmailSiteUrl(): string {
  return getSiteUrl();
}

export function getCheckoutEmailLogoUrl(): string {
  return `${getCheckoutEmailSiteUrl()}/wehrli-licht-logo.svg`;
}
