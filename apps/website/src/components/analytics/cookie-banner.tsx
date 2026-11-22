'use client';

import { analytics } from '@/integrations/client';
import type { ConsentChoice } from '@/ports/analytics';
import { CookieBanner as CookieBannerView, FooterLinkButton } from '@wehrli/design-system';
import { FC, useEffect, useState } from 'react';

/** Fired on window to reopen the cookie banner (e.g. from the footer). */
const OPEN_CONSENT_BANNER_EVENT = 'wehrli:open-consent-banner';

type BannerState = 'initial' | 'closed' | 'reopened';

/**
 * The banner is rendered into the server HTML so it paints together with the
 * page instead of popping in after hydration (it would otherwise become the
 * LCP element on mobile). Visitors who already chose are hidden by CSS before
 * first paint via `html[data-consent]`, set by the analytics head script.
 */
type Props = {
  /** Privacy page from DatoCMS («Header & Footer»), link omitted if not set. */
  privacyHref: string | null;
  /** Text and buttons (CMS «Texte & Beschriftungen»). */
  labels: { text: string; accept: string; decline: string };
};

export const CookieBanner: FC<Props> = ({ privacyHref, labels }) => {
  const [state, setState] = useState<BannerState>('initial');

  useEffect(() => {
    if (analytics.readConsent() !== null) {
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
    analytics.applyConsent(choice);
    setState('closed');
  };

  return (
    <CookieBannerView
      labels={labels}
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
