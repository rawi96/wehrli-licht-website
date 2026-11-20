'use client';

import { ConsentChoice, OPEN_CONSENT_BANNER_EVENT } from '@/lib/analytics/config';
import { applyConsentChoice, readConsentChoice } from '@/lib/analytics/gtag';
import Link from 'next/link';
import { FC, useEffect, useState } from 'react';

const buttonBase =
  'min-h-11 rounded px-4 py-2 text-sm font-bold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wehrli';

export const CookieBanner: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line @eslint-react/set-state-in-effect -- the choice lives in localStorage, only readable after mount
    setIsOpen(readConsentChoice() === null);

    const open = () => setIsOpen(true);
    window.addEventListener(OPEN_CONSENT_BANNER_EVENT, open);

    return () => window.removeEventListener(OPEN_CONSENT_BANNER_EVENT, open);
  }, []);

  if (!isOpen) {
    return null;
  }

  const choose = (choice: ConsentChoice) => {
    applyConsentChoice(choice);
    setIsOpen(false);
  };

  return (
    <section
      aria-label="Cookie-Einstellungen"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-xl rounded bg-white p-5 shadow-lg ring-1 ring-gray-200 sm:left-6 sm:mx-0 sm:p-6"
    >
      <p className="text-wehrli text-base font-bold">Cookies &amp; Datenschutz</p>
      <p className="mt-2 text-sm text-gray-700">
        Wir werten die Nutzung unserer Website mit Google Analytics statistisch aus, um sie laufend zu verbessern. Mit Ihrer
        Zustimmung nutzen wir zusätzlich Cookies von Google Ads, um Ihnen passende Werbung zu zeigen. Mehr dazu in unserer{' '}
        <Link href="/datenschutz" className="text-wehrli font-bold underline">
          Datenschutzerklärung
        </Link>
        .
      </p>
      <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => choose('denied')}
          className={`${buttonBase} hover:border-wehrli hover:text-wehrli border border-gray-300 text-gray-800`}
        >
          Ablehnen
        </button>
        <button
          type="button"
          onClick={() => choose('granted')}
          className={`${buttonBase} bg-wehrli hover:bg-wehrli/90 text-white`}
        >
          Akzeptieren
        </button>
      </div>
    </section>
  );
};

export const CookieSettingsButton: FC<{ className?: string }> = ({ className }) => (
  <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_BANNER_EVENT))}>
    Cookie-Einstellungen
  </button>
);
