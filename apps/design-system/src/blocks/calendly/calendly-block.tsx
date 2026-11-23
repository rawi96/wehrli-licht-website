'use client';

import { CheckIcon } from '@heroicons/react/20/solid';
import { FC, useEffect, useRef } from 'react';
import { Image, ImageData } from '../../content/image/image';
import { Section } from '../../layout/section/section';
import { Heading } from '../../typography/heading/heading';
import type { BlockMargins } from '../block-margins';

declare global {
  interface Window {
    Calendly?: { initInlineWidget: (options: { url: string; parentElement: HTMLElement }) => void };
  }
}

type Props = BlockMargins & {
  /** Calendly booking link. Without it nothing is rendered. */
  url?: string | null;
  /** Shown beside the calendar; the widget then hides its own event details. */
  title?: string | null;
  intro?: string | null;
  /** Short facts with a check mark, e.g. duration or what to bring. */
  points?: string[];
  /** The person the visitor meets. */
  person?: { name: string; role?: string | null; image?: ImageData | null } | null;
  anchorId?: string | null;
  labels?: { person: string };
};

/** The booking link without Calendly's own details panel and cookie banner text (the page shows title and intro). */
const compactUrl = (url: string): string => {
  const link = new URL(url);
  link.searchParams.set('hide_event_type_details', '1');
  link.searchParams.set('hide_gdpr_banner', '1');

  return link.toString();
};

/**
 * Calendly booking widget in two columns: title and intro on the left, the calendar in a card on the right (stacked on
 * phones). Calendly is heavy (~1 MB, third-party cookies): its script loads only when the widget is about to scroll
 * into view.
 */
export const CalendlyBlock: FC<Props> = ({
  url: rawUrl,
  title,
  intro,
  points = [],
  person,
  anchorId,
  marginTop,
  marginBottom,
  labels = { person: 'Ihre Ansprechperson' },
}) => {
  const url = rawUrl ? compactUrl(rawUrl) : null;
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
    <Section id={anchorId} scrollMargin marginTop={marginTop} marginBottom={marginBottom}>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
        <div className="flex flex-col gap-8 lg:sticky lg:top-28 lg:self-start">
          <div>
            {title ? <Heading level="2">{title}</Heading> : null}
            {intro ? <p className="text-sm whitespace-pre-line text-black">{intro}</p> : null}
          </div>
          {points.length > 0 ? (
            <ul className="flex flex-col gap-3 text-sm text-black">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="bg-wehrli mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-white">
                    <CheckIcon className="size-3.5" aria-hidden="true" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          ) : null}
          {person ? (
            <div className="card-surface flex items-center gap-4 p-4">
              {person.image ? (
                <div className="relative size-16 shrink-0 overflow-hidden rounded-full">
                  <Image image={person.image} sizes="64px" absolute />
                </div>
              ) : null}
              <div>
                <p className="text-xs text-gray-600">{labels.person}</p>
                <p className="text-wehrli text-sm font-bold">{person.name}</p>
                {person.role ? <p className="text-xs text-black">{person.role}</p> : null}
              </div>
            </div>
          ) : null}
        </div>
        <div className="card-surface overflow-hidden">
          <div
            ref={containerRef}
            // Marker class of the Calendly embed script.
            // eslint-disable-next-line better-tailwindcss/no-unknown-classes
            className="calendly-inline-widget"
            data-url={url}
            style={{ minWidth: '320px', height: '700px' }}
          />
        </div>
      </div>
    </Section>
  );
};
