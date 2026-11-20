'use client';

import { trackEvent } from '@/lib/analytics/gtag';
import { FC, useEffect } from 'react';

/**
 * Tracks clicks on phone and e-mail links anywhere on the site, including
 * links coming from DatoCMS rich text, with one delegated listener.
 */
export const ContactClickTracking: FC = () => {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a[href^="tel:"], a[href^="mailto:"]');
      if (!link) {
        return;
      }

      const href = link.getAttribute('href') ?? '';
      const isPhone = href.startsWith('tel:');

      trackEvent(isPhone ? 'telefon_klick' : 'email_klick', {
        link_url: href,
        page_path: window.location.pathname,
      });
    };

    document.addEventListener('click', onClick, { capture: true });

    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  return null;
};
