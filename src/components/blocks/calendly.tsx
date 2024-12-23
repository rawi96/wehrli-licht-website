'use client';

import { CalendlyBlockFragment } from '@/graphql/generated';
import { FC, useEffect } from 'react';
import { BlockWrapper } from '../block-wrapper';

type Props = {
  block: CalendlyBlockFragment;
};

export const CalendlyBlock: FC<Props> = ({ block: { disableMarginBottom, disableMarginTop } }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <BlockWrapper disableMarginTop={disableMarginTop} disableMarginBottom={disableMarginBottom}>
      <div
        className="calendly-inline-widget"
        data-url="https://calendly.com/kleinstein-mariella/60min?primary_color=214073"
        style={{ minWidth: '320px', height: '700px' }}
      ></div>
    </BlockWrapper>
  );
};
