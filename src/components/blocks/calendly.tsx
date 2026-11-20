'use client';

import { CalendlyBlockFragment } from '@/graphql/generated';
import { trackEvent } from '@/lib/analytics/gtag';
import { FC, useEffect, useMemo } from 'react';
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

  useEffect(() => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-calendly-widget="true"]');
    if (existing) {
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.dataset.calendlyWidget = 'true';
    document.body.appendChild(script);
  }, []);

  return (
    <BlockWrapper disableMarginTop={disableMarginTop} disableMarginBottom={disableMarginBottom}>
      <div className="calendly-inline-widget" data-url={calendlyUrl} style={{ minWidth: '320px', height: '700px' }} />
    </BlockWrapper>
  );
};
