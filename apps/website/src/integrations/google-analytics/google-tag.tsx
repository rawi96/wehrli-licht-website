import { CONSENT_STORAGE_KEY, GA_MEASUREMENT_ID, GOOGLE_ADS_ID, getConsentState } from './config';
import Script from 'next/script';
import { FC } from 'react';

/**
 * Sets the consent defaults before the Google tag loads, then configures GA4 and Google Ads.
 * Runs inline in <head> so no hit is sent before consent is known. The consent states are
 * computed on the server from the same function the banner uses for updates.
 */
const buildInitScript = (gaId: string, adsId: string | undefined) => {
  const states = {
    unset: getConsentState(null),
    granted: getConsentState('granted'),
    denied: getConsentState('denied'),
  };
  const adsConfig = adsId ? `gtag('config', ${JSON.stringify(adsId)}, { allow_enhanced_conversions: true });` : '';

  return `(function () {
window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
window.gtag = gtag;
var choice = null;
try { choice = localStorage.getItem(${JSON.stringify(CONSENT_STORAGE_KEY)}); } catch (e) {}
if (choice !== 'granted' && choice !== 'denied') { choice = null; }
if (choice) { document.documentElement.dataset.consent = choice; }
var states = ${JSON.stringify(states)};
var state = states[choice || 'unset'];
state.wait_for_update = 500;
gtag('consent', 'default', state);
gtag('set', 'ads_data_redaction', choice !== 'granted');
gtag('js', new Date());
gtag('config', ${JSON.stringify(gaId)});
${adsConfig}
})();`;
};

export const GoogleTag: FC = () => {
  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <script
        id="google-tag-init"
        // eslint-disable-next-line @eslint-react/dom-no-dangerously-set-innerhtml -- static, trusted init snippet
        dangerouslySetInnerHTML={{ __html: buildInitScript(GA_MEASUREMENT_ID, GOOGLE_ADS_ID) }}
      />
      {/* afterInteractive, not lazyOnload: gtag.js must read the landing URL (gclid) before a
          client-side navigation drops it, or Google Ads clicks go unattributed. */}
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
    </>
  );
};
