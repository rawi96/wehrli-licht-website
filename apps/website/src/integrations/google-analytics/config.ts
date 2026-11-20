import type { ConsentChoice } from '@/ports/analytics';

/**
 * Google tag configuration. Both IDs are only set on the production deployment,
 * so local development and preview deployments never send data to Google.
 */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

export const isTrackingEnabled = Boolean(GA_MEASUREMENT_ID);

/** localStorage key holding the visitor's banner choice. */
export const CONSENT_STORAGE_KEY = 'wehrli-consent';

/**
 * Consent model ("Variante 3", Swiss opt-out):
 * - no choice yet: statistics on, advertising off
 * - accepted: statistics and advertising on
 * - declined: everything off (the Google tag only sends cookieless pings)
 * Shared by the inline init script (consent default) and the banner (consent update).
 */
export const getConsentState = (choice: ConsentChoice | null) => {
  const ads = choice === 'granted' ? 'granted' : 'denied';

  return {
    analytics_storage: choice === 'denied' ? 'denied' : 'granted',
    ad_storage: ads,
    ad_user_data: ads,
    ad_personalization: ads,
  } as const;
};
