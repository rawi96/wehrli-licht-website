'use client';

import { CalendlyBlockFragment } from '@/graphql/generated';
import { analytics } from '@/integrations/client';
import { CalendlyBlock as CalendlyBlockView } from '@wehrli/design-system';
import { FC, useEffect } from 'react';

type Props = {
  block: CalendlyBlockFragment;
};

export const CalendlyBlock: FC<Props> = ({ block: { url, disableMarginBottom, disableMarginTop } }) => {
  // Calendly reports bookings from its iframe via postMessage.
  useEffect(() => {
    const onMessage = (event: MessageEvent<{ event?: string }>) => {
      if (event.origin === 'https://calendly.com' && event.data.event === 'calendly.event_scheduled') {
        analytics.trackEvent('termin_gebucht', { lead_source: 'calendly' });
      }
    };

    window.addEventListener('message', onMessage);

    return () => window.removeEventListener('message', onMessage);
  }, []);

  // The booking link is configured on the block in DatoCMS.
  return <CalendlyBlockView url={url} marginTop={!disableMarginTop} marginBottom={!disableMarginBottom} />;
};
