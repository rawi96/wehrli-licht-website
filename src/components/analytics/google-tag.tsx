import { CONSENT_STORAGE_KEY, GA_MEASUREMENT_ID, GOOGLE_ADS_ID } from '@/lib/analytics/config';
import Script from 'next/script';
import { FC } from 'react';

/**
 * The gtag library itself is loaded lazily (after page load) to keep it out of
 * the critical path; events queue in dataLayer until then.
 *
 * Sets the consent defaults before the Google tag loads, then configures GA4
 * and Google Ads. Runs inline in <head> so no hit is sent before consent is known.
 */
const buildInitScript = (gaId: string, adsId: string | undefined) => `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
var choice = null;
try { choice = localStorage.getItem(${JSON.stringify(CONSENT_STORAGE_KEY)}); } catch (e) {}
if (choice) { document.documentElement.dataset.consent = choice; }
var ads = choice === 'granted' ? 'granted' : 'denied';
gtag('consent', 'default', {
  analytics_storage: choice === 'denied' ? 'denied' : 'granted',
  ad_storage: ads,
  ad_user_data: ads,
  ad_personalization: ads,
  wait_for_update: 500
});
gtag('set', 'ads_data_redaction', ads === 'denied');
gtag('js', new Date());
gtag('config', ${JSON.stringify(gaId)});
${adsId ? `gtag('config', ${JSON.stringify(adsId)}, { allow_enhanced_conversions: true });` : ''}
`;

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
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="lazyOnload" />
    </>
  );
};
