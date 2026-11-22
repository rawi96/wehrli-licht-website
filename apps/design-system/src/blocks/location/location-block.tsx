import { ClockIcon, EnvelopeIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { cn } from '../../fundamentals/cn';
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

const rowClasses = 'flex gap-x-3';
const iconClasses = 'text-wehrli mt-0.5 size-5 shrink-0';
const linkClasses = 'text-wehrli font-bold underline-offset-4 hover:underline';
const richTextClasses = 'text-sm text-gray-600 [&_li+li]:mt-0.5 [&_p]:m-0 [&_p+p]:mt-1.5 [&_ul]:mt-1';

/**
 * Address, phone, e-mail and opening hours of the business (from the CMS settings, maintained once) with an optional
 * map beside them. Two columns from lg, the map below on small screens.
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

  return (
    <Section id={anchorId} marginTop={marginTop} marginBottom={marginBottom}>
      <div className={cn('grid gap-6', mapSrc && 'lg:grid-cols-2')}>
        <div className="flex flex-col gap-6 rounded-md bg-white p-6 shadow-sm sm:p-8">
          <Heading level="2">{title}</Heading>

          <address className="flex flex-col gap-4 text-sm not-italic">
            <div className={rowClasses}>
              <MapPinIcon className={iconClasses} aria-hidden="true" />
              <div>
                {companyName && <p className="font-bold text-black">{companyName}</p>}
                {street && <p>{street}</p>}
                {town ? <p>{town}</p> : null}
                {mapsHref && (
                  <a
                    href={mapsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${linkClasses} mt-1 inline-block`}
                  >
                    {labels?.route ?? 'Route planen'}
                  </a>
                )}
              </div>
            </div>
            {phone && (
              <div className={rowClasses}>
                <PhoneIcon className={iconClasses} aria-hidden="true" />
                <a href={`tel:${phone.replace(/\s/g, '')}`} className={linkClasses}>
                  {phone}
                </a>
              </div>
            )}
            {email && (
              <div className={rowClasses}>
                <EnvelopeIcon className={iconClasses} aria-hidden="true" />
                <a href={`mailto:${email}`} className={linkClasses}>
                  {email}
                </a>
              </div>
            )}
          </address>

          {holiday && (
            <div className="bg-wehrli-50 rounded-md p-4">
              <p className="text-wehrli text-sm font-bold">{holiday.title}</p>
              <div className={`mt-1 ${richTextClasses}`}>{holiday.text}</div>
            </div>
          )}

          {openingHours && (
            <div className={rowClasses}>
              <ClockIcon className={iconClasses} aria-hidden="true" />
              <div>
                <p className="text-sm font-bold text-black">{openingHours.title}</p>
                <div className={`mt-1 ${richTextClasses}`}>{openingHours.text}</div>
              </div>
            </div>
          )}
        </div>

        {mapSrc && (
          <iframe
            title={labels?.map ?? 'Karte'}
            src={mapSrc}
            className="h-full min-h-80 w-full rounded-md border-0 shadow-sm"
            loading="lazy"
            allowFullScreen
          />
        )}
      </div>
    </Section>
  );
};
