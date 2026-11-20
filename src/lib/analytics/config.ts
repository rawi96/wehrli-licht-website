/**
 * Google tag configuration. Both IDs are only set on the production deployment,
 * so local development and preview deployments never send data to Google.
 */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

export const isTrackingEnabled = Boolean(GA_MEASUREMENT_ID);

/** localStorage key holding the visitor's banner choice. */
export const CONSENT_STORAGE_KEY = 'wehrli-consent';

export type ConsentChoice = 'granted' | 'denied';

/** Fired on window to reopen the cookie banner (e.g. from the footer). */
export const OPEN_CONSENT_BANNER_EVENT = 'wehrli:open-consent-banner';
