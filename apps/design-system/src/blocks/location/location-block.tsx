import { FC, ReactNode } from 'react';
import { Heading } from '../../typography/heading/heading';
import { Section } from '../../layout/section/section';
import type { BlockMargins } from '../block-margins';

type Notice = {
  title: string;
  /** Rich text (the website renders the CMS HTML). */
  text: ReactNode;
};

type Props = BlockMargins & {
  title: string;
  /** Anchor of the section, e.g. «anfahrt». */
  anchorId?: string | null;
  companyName?: string | null;
  street?: string | null;
  zip?: string | null;
  place?: string | null;
  phone?: string | null;
  email?: string | null;
  /** Google Maps link around the address («Route planen»). */
  mapsHref?: string | null;
  openingHours?: Notice | null;
  /** E.g. holiday closures, highlighted above the opening hours. */
  holiday?: Notice | null;
  /** Embed URL of a map, shown beside the details. */
  mapSrc?: string | null;
  labels?: { route?: string; map?: string };
};

const linkClasses = 'text-wehrli hover:text-wehrli-dark font-bold transition-colors';
const richTextClasses = 'text-sm text-black [&_li+li]:mt-0.5 [&_p]:m-0 [&_p+p]:mt-1.5 [&_ul]:mt-1';

/**
 * Address, phone, e-mail and opening hours of the business (from the CMS settings, maintained once). With a map in
 * two columns like the contact form and the booking widget: details on the left, the map in a card on the right
 * (below on small screens).
 */
export const LocationBlock: FC<Props> = ({
  title,
  anchorId,
  companyName,
  street,
  zip,
  place,
  phone,
  email,
  mapsHref,
  openingHours,
  holiday,
  mapSrc,
  labels,
  marginTop,
  marginBottom,
}) => {
  // Empty CMS fields may be '' rather than null.
  const town = [zip, place]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(' ');

  const details = (
    <div className="flex flex-col gap-8">
      <Heading level="2">{title}</Heading>

      <address className="flex flex-col gap-3 text-sm text-black not-italic">
        <div>
          <div>
            {companyName && <p className="font-bold text-black">{companyName}</p>}
            {street && <p>{street}</p>}
            {town ? <p>{town}</p> : null}
            {mapsHref && (
              <a href={mapsHref} target="_blank" rel="noopener noreferrer" className={`${linkClasses} mt-1 inline-block`}>
                {labels?.route ?? 'Route planen'}
              </a>
            )}
          </div>
        </div>
        {phone && (
          <div>
            <a href={`tel:${phone.replace(/\s/g, '')}`} className={linkClasses}>
              {phone}
            </a>
          </div>
        )}
        {email && (
          <div>
            <a href={`mailto:${email}`} className={linkClasses}>
              {email}
            </a>
          </div>
        )}
      </address>

      {holiday && (
        <div className="card-surface p-4">
          <p className="text-wehrli text-sm font-bold">{holiday.title}</p>
          <div className={`mt-1 ${richTextClasses}`}>{holiday.text}</div>
        </div>
      )}

      {openingHours && (
        <div>
          <div>
            <p className="text-wehrli text-sm font-bold">{openingHours.title}</p>
            <div className={`mt-1 ${richTextClasses}`}>{openingHours.text}</div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Section id={anchorId} scrollMargin marginTop={marginTop} marginBottom={marginBottom}>
      {mapSrc ? (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">{details}</div>
          <div className="card-surface min-h-96 overflow-hidden lg:min-h-120">
            <iframe
              title={labels?.map ?? 'Karte'}
              src={mapSrc}
              className="size-full min-h-96 border-0 lg:min-h-120"
              loading="lazy"
              allowFullScreen
            />
          </div>
        </div>
      ) : (
        details
      )}
    </Section>
  );
};
