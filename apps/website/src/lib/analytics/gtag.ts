import { CONSENT_STORAGE_KEY, ConsentChoice, getConsentState } from './config';

type GtagParams = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const gtag = (...args: unknown[]) => {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return;
  }

  window.gtag(...args);
};

/**
 * Sends a GA4 event. No-op when the Google tag is not configured (local, previews).
 * Consent is applied by the Google tag itself (cookieless ping after «Ablehnen»).
 */
export const trackEvent = (name: string, params: GtagParams = {}) => {
  gtag('event', name, params);
};

export const readConsentChoice = (): ConsentChoice | null => {
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);

    return value === 'granted' || value === 'denied' ? value : null;
  } catch {
    return null;
  }
};

/** Stores the banner choice and updates the Google tag consent, see getConsentState. */
export const applyConsentChoice = (choice: ConsentChoice) => {
  document.documentElement.dataset.consent = choice;

  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    // Storage blocked: the choice still applies for this page view.
  }

  gtag('consent', 'update', getConsentState(choice));
  gtag('set', 'ads_data_redaction', choice !== 'granted');
};

/**
 * Enhanced conversions: hands the e-mail address to the Google tag, which
 * normalizes and SHA-256 hashes it before sending. Only with ad consent.
 */
export const setEnhancedConversionEmail = (email: string) => {
  if (readConsentChoice() !== 'granted') {
    return;
  }

  gtag('set', 'user_data', { email: email.trim().toLowerCase() });
};
