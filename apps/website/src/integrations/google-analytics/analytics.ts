import type { Analytics } from '@/ports/analytics';
import { isTrackingEnabled } from './config';
import { GoogleTag } from './google-tag';
import { applyConsentChoice, readConsentChoice, setEnhancedConversionEmail, trackEvent } from './gtag';
import { trackPurchaseOnce } from './purchase';

/** Google Analytics 4 and Google Ads through the Google tag (gtag.js) with Consent Mode. */
export const googleAnalytics: Analytics = {
  isEnabled: isTrackingEnabled,
  HeadScripts: GoogleTag,
  trackEvent,
  trackPurchase: trackPurchaseOnce,
  setLeadEmail: setEnhancedConversionEmail,
  readConsent: readConsentChoice,
  applyConsent: applyConsentChoice,
};
