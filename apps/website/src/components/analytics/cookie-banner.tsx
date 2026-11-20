'use client';

import { ConsentChoice, OPEN_CONSENT_BANNER_EVENT } from '@/lib/analytics/config';
import { applyConsentChoice, readConsentChoice } from '@/lib/analytics/gtag';
import { CookieBanner as CookieBannerView, FooterLinkButton } from '@wehrli/design-system';
import { FC, useEffect, useState } from 'react';

type BannerState = 'initial' | 'closed' | 'reopened';

/**
 * The banner is rendered into the server HTML so it paints together with the
 * page instead of popping in after hydration (it would otherwise become the
 * LCP element on mobile). Visitors who already chose are hidden by CSS before
 * first paint via `html[data-consent]`, set by the Google tag init script.
 */
type Props = {
  /** Privacy page from DatoCMS («Header & Footer»), link omitted if not set. */
  privacyHref: string | null;
};

export const CookieBanner: FC<Props> = ({ privacyHref }) => {
  const [state, setState] = useState<BannerState>('initial');

  useEffect(() => {
    if (readConsentChoice() !== null) {
      // eslint-disable-next-line @eslint-react/set-state-in-effect -- the choice lives in localStorage, only readable after mount
      setState('closed');
    }

    const open = () => setState('reopened');
    window.addEventListener(OPEN_CONSENT_BANNER_EVENT, open);

    return () => window.removeEventListener(OPEN_CONSENT_BANNER_EVENT, open);
  }, []);

  if (state === 'closed') {
    return null;
  }

  const choose = (choice: ConsentChoice) => {
    applyConsentChoice(choice);
    setState('closed');
  };

  return (
    <CookieBannerView
      labels={{
        text: 'Wir nutzen Google Analytics, um die Website zu verbessern, und mit Ihrer Zustimmung Google Ads für passende Werbung.',
      }}
      privacyHref={privacyHref}
      reopened={state === 'reopened'}
      onDecline={() => choose('denied')}
      onAccept={() => choose('granted')}
    />
  );
};

/** Footer entry that reopens the banner. */
export const CookieSettingsButton: FC = () => (
  <FooterLinkButton onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_BANNER_EVENT))}>
    Cookie-Einstellungen
  </FooterLinkButton>
);
