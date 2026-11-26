import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid';
import { FC } from 'react';
import { CARD_COLUMNS, GRID_COLUMN_CLASSES } from '../../layout/grid/grid';
import { cn } from '../../fundamentals/cn';
import { Section } from '../../layout/section/section';
import type { BlockMargins } from '../block-margins';
import { BlockIntro } from '../block-intro';

export type PartnerItem = {
  id: string;
  name: string;
  logo: { src: string; width?: number | null; height?: number | null };
  /** E.g. «Flawil, Schweiz». */
  place?: string | null;
  description?: string | null;
  website?: string | null;
};

type Props = BlockMargins & {
  title?: string | null;
  intro?: string | null;
  partners: PartnerItem[];
  anchorId?: string | null;
  labels?: { website: string };
};

const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

/** Partners as cards: logo, name, place, a short text and a link to their website. */
export const PartnersBlock: FC<Props> = ({
  title,
  intro,
  partners,
  anchorId,
  marginTop,
  marginBottom,
  labels = { website: 'Website' },
}) => (
  <Section id={anchorId} scrollMargin marginTop={marginTop} marginBottom={marginBottom}>
    <BlockIntro title={title} intro={intro} />
    <ul className={cn('grid grid-cols-1 gap-4 lg:gap-6', GRID_COLUMN_CLASSES[CARD_COLUMNS])}>
      {partners.map((partner) => (
        <li key={partner.id} className="card-surface flex flex-col overflow-hidden">
          <div className="flex h-32 items-center justify-center border-b border-gray-100 px-10 py-8">
            {/* Logos come in many formats: shown whole, never cropped. */}
            <img
              src={partner.logo.src}
              width={partner.logo.width ?? undefined}
              height={partner.logo.height ?? undefined}
              alt={`Logo ${partner.name}`}
              loading="lazy"
              className="max-h-full w-auto max-w-48 object-contain"
            />
          </div>
          <div className="flex flex-1 flex-col p-6">
            <h3 className="text-wehrli text-base font-bold">{partner.name}</h3>
            {partner.place ? <p className="mt-1 text-xs text-gray-600">{partner.place}</p> : null}
            {partner.description ? <p className="mt-3 text-sm text-black">{partner.description}</p> : null}
            {partner.website ? (
              <a
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-wehrli hover:text-wehrli-dark mt-auto flex items-center gap-1.5 pt-5 text-sm font-bold"
              >
                {labels.website}: {hostOf(partner.website)}
                <ArrowTopRightOnSquareIcon className="size-4" aria-hidden="true" />
              </a>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  </Section>
);
