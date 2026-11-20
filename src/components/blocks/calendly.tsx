'use client';

import { CalendlyBlockFragment } from '@/graphql/generated';
import { trackEvent } from '@/lib/analytics/gtag';
import { FC, useEffect, useMemo, useRef } from 'react';
import { BlockWrapper } from '../block-wrapper';

type Props = {
  block: CalendlyBlockFragment;
};

export const CalendlyBlock: FC<Props> = ({ block: { disableMarginBottom, disableMarginTop } }) => {
  const calendlyUrl = useMemo(() => 'https://calendly.com/wehrli-licht/60min?primary_color=214073', []);

  // Calendly reports bookings from its iframe via postMessage.
  useEffect(() => {
    const onMessage = (event: MessageEvent<{ event?: string }>) => {
      if (event.origin === 'https://calendly.com' && event.data.event === 'calendly.event_scheduled') {
        trackEvent('termin_gebucht', { lead_source: 'calendly' });
      }
    };

    window.addEventListener('message', onMessage);

    return () => window.removeEventListener('message', onMessage);
  }, []);

  // Calendly is heavy (~1 MB, third-party cookies): only load it once the
  // widget is about to scroll into view.
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const load = () => {
      if (document.querySelector('script[data-calendly-widget="true"]')) {
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      script.dataset.calendlyWidget = 'true';
      document.body.appendChild(script);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          load();
        }
      },
      { rootMargin: '600px 0px' },
    );
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  return (
    <BlockWrapper disableMarginTop={disableMarginTop} disableMarginBottom={disableMarginBottom}>
      <div
        ref={containerRef}
        className="calendly-inline-widget"
        data-url={calendlyUrl}
        style={{ minWidth: '320px', height: '700px' }}
      />
    </BlockWrapper>
  );
};
