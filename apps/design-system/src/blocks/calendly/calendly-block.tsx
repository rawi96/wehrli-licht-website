'use client';

import { FC, useEffect, useRef } from 'react';
import { Section } from '../../layout/section/section';
import type { BlockMargins } from '../block-margins';

declare global {
  interface Window {
    Calendly?: { initInlineWidget: (options: { url: string; parentElement: HTMLElement }) => void };
  }
}

type Props = BlockMargins & {
  /** Calendly booking link. Without it nothing is rendered. */
  url?: string | null;
};

/**
 * Inline Calendly booking widget, 700px high. Calendly is heavy (~1 MB, third-party cookies): its script loads only
 * when the widget is about to scroll into view.
 */
export const CalendlyBlock: FC<Props> = ({ url, marginTop, marginBottom }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !url) {
      return;
    }

    // widget.js auto-initializes inline widgets only once, when it first runs. After a
    // client-side navigation the script is already there, so initialize explicitly.
    const initWidget = () => {
      if (container.querySelector('iframe')) {
        return;
      }
      window.Calendly?.initInlineWidget({ url, parentElement: container });
    };

    let script = document.querySelector<HTMLScriptElement>('script[data-calendly-widget="true"]');

    const load = () => {
      if (script && window.Calendly) {
        initWidget();

        return;
      }

      if (!script) {
        script = document.createElement('script');
        script.src = 'https://assets.calendly.com/assets/external/widget.js';
        script.async = true;
        script.dataset.calendlyWidget = 'true';
        document.body.appendChild(script);
      }
      script.addEventListener('load', initWidget, { once: true });
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

    return () => {
      observer.disconnect();
      script?.removeEventListener('load', initWidget);
    };
  }, [url]);

  if (!url) {
    return null;
  }

  return (
    <Section marginTop={marginTop} marginBottom={marginBottom}>
      <div
        ref={containerRef}
        // Marker class of the Calendly embed script.
        // eslint-disable-next-line better-tailwindcss/no-unknown-classes
        className="calendly-inline-widget"
        data-url={url}
        style={{ minWidth: '320px', height: '700px' }}
      />
    </Section>
  );
};
