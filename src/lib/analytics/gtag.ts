import { CONSENT_STORAGE_KEY, ConsentChoice } from './config';

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
 * Sends a GA4 event. No-op when the Google tag is not loaded (local, previews)
 * or the visitor declined tracking.
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

/**
 * Consent model ("Variante 3", Swiss opt-out):
 * - no choice yet: statistics on, advertising off
 * - accepted: statistics and advertising on
 * - declined: everything off
 */
export const applyConsentChoice = (choice: ConsentChoice) => {
  document.documentElement.dataset.consent = choice;

  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    // Storage blocked: the choice still applies for this page view.
  }

  const ads = choice === 'granted' ? 'granted' : 'denied';

  gtag('consent', 'update', {
    analytics_storage: choice,
    ad_storage: ads,
    ad_user_data: ads,
    ad_personalization: ads,
  });
  gtag('set', 'ads_data_redaction', ads === 'denied');
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
