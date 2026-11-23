import { EnvelopeIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { FC, ReactNode } from 'react';
import { Section } from '../../layout/section/section';
import { Heading } from '../../typography/heading/heading';
import type { BlockMargins } from '../block-margins';

/** Ways to reach the company without the form, shown beside it. */
export type DirectContact = {
  phone?: string | null;
  email?: string | null;
  /** Address lines, e.g. street and place. */
  address?: string[];
  mapsHref?: string | null;
};

type Props = BlockMargins & {
  /** Anchor, so links can jump straight to the form. */
  anchorId: string;
  title?: string | null;
  /** Text beside the form, line breaks are kept. */
  intro?: string | null;
  /** Phone, e-mail and address beside the form. */
  direct?: DirectContact | null;
  /** The form, usually `ContactForm` (the website connects it to its API). */
  children: ReactNode;
  labels?: { direct: string };
};

const linkClass = 'text-wehrli hover:text-wehrli-dark font-bold transition-colors';

/**
 * Contact form in two columns: heading, intro and direct contact on the left, the form in a card on the right
 * (stacked on phones). Clear of the sticky header when jumped to.
 */
export const ContactFormBlock: FC<Props> = ({
  anchorId,
  title,
  intro,
  direct,
  children,
  marginTop,
  marginBottom,
  labels = { direct: 'Lieber direkt?' },
}) => (
  <Section scrollMargin id={anchorId} marginTop={marginTop} marginBottom={marginBottom}>
    <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
      <div className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
        <div>
          {title && <Heading level="2">{title}</Heading>}
          {intro && <p className="text-sm whitespace-pre-line text-black">{intro}</p>}
        </div>
        {direct && (direct.phone || direct.email || direct.address?.length) ? (
          <div className="border-t border-gray-200 pt-6">
            <p className="mb-4 text-sm font-bold text-black">{labels.direct}</p>
            <ul className="flex flex-col gap-3 text-sm">
              {direct.phone ? (
                <li className="flex items-center gap-3">
                  <PhoneIcon className="text-wehrli size-5 shrink-0" aria-hidden="true" />
                  <a href={`tel:${direct.phone.replace(/\s/g, '')}`} className={linkClass}>
                    {direct.phone}
                  </a>
                </li>
              ) : null}
              {direct.email ? (
                <li className="flex items-center gap-3">
                  <EnvelopeIcon className="text-wehrli size-5 shrink-0" aria-hidden="true" />
                  <a href={`mailto:${direct.email}`} className={linkClass}>
                    {direct.email}
                  </a>
                </li>
              ) : null}
              {direct.address?.length ? (
                <li className="flex items-start gap-3">
                  <MapPinIcon className="text-wehrli size-5 shrink-0" aria-hidden="true" />
                  {direct.mapsHref ? (
                    <a href={direct.mapsHref} target="_blank" rel="noopener noreferrer" className={linkClass}>
                      {direct.address.join(', ')}
                    </a>
                  ) : (
                    <span>{direct.address.join(', ')}</span>
                  )}
                </li>
              ) : null}
            </ul>
          </div>
        ) : null}
      </div>
      <div className="card-surface p-6 sm:p-8 lg:p-10">{children}</div>
    </div>
  </Section>
);
