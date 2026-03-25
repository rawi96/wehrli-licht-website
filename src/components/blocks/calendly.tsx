'use client';

import { CalendlyBlockFragment } from '@/graphql/generated';
import { FC, useEffect, useMemo } from 'react';
import { BlockWrapper } from '../block-wrapper';

type Props = {
  block: CalendlyBlockFragment;
};

export const CalendlyBlock: FC<Props> = ({ block: { disableMarginBottom, disableMarginTop } }) => {
  const calendlyUrl = useMemo(() => 'https://calendly.com/wehrli-licht/60min?primary_color=214073', []);

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
