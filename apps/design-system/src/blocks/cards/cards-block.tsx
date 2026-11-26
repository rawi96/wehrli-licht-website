import { ArrowRightIcon } from '@heroicons/react/20/solid';
import NextLink from 'next/link';
import { createElement, FC } from 'react';
import { CARD_COLUMNS, GRID_COLUMN_CLASSES } from '../../layout/grid/grid';
import { cn } from '../../fundamentals/cn';
import { Section } from '../../layout/section/section';
import type { LinkData } from '../../typography/text-link/text-link';
import type { BlockMargins } from '../block-margins';
import { BlockIntro } from '../block-intro';
import { CARD_ICONS, CardIconName } from './card-icons';

export type CardItem = {
  id: string;
  icon?: CardIconName | null;
  title: string;
  text?: string | null;
  /** The whole card links here; the label shows at the bottom. */
  link?: LinkData | null;
  /** A colour shown as a swatch above the text, as hex (`#214073`), e.g. for brand colours. */
  swatch?: string | null;
  /** A picture shown whole above the text, e.g. a logo; `dark` puts it on the brand blue (white logo). */
  preview?: { src: string; alt: string; dark?: boolean } | null;
};

type Props = BlockMargins & {
  title?: string | null;
  intro?: string | null;
  items: CardItem[];
  anchorId?: string | null;
};

/**
 * Short topics as cards with a symbol, e.g. the sub-pages of a hub or the strengths of a service. A card with a link
 * is clickable as a whole and lifts on hover.
 */
export const CardsBlock: FC<Props> = ({ title, intro, items, anchorId, marginTop, marginBottom }) => (
  <Section id={anchorId} scrollMargin marginTop={marginTop} marginBottom={marginBottom}>
    <BlockIntro title={title} intro={intro} />
    <ul className={cn('grid grid-cols-1 gap-4 lg:gap-6', GRID_COLUMN_CLASSES[CARD_COLUMNS])}>
      {items.map((item) => (
        <li key={item.id} className="flex">
          <CardBody item={item} headingLevel={title ? 'h3' : 'h2'} />
        </li>
      ))}
    </ul>
  </Section>
);

/** Relative luminance of a hex colour (0 dark … 1 light), to pick a readable label colour on the swatch. */
const luminance = (hex: string): number => {
  const raw = hex.replace('#', '');
  // #abc → aabbcc; an alpha channel (#rrggbbaa) is ignored.
  const value = raw.length <= 4 ? [...raw.slice(0, 3)].map((digit) => digit + digit).join('') : raw.slice(0, 6);
  const [r, g, b] = [0, 2, 4].map((start) => parseInt(value.slice(start, start + 2), 16) / 255);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/** Swatch or picture across the top of the card (bleeds into the card's padding). */
const CardMedia: FC<{ item: CardItem }> = ({ item }) => {
  const bleed = '-mx-6 -mt-6 mb-6 lg:-mx-8 lg:-mt-8';

  if (item.swatch) {
    return (
      <div
        className={cn(bleed, 'flex h-32 items-end p-4 ring-1 ring-black/5 ring-inset')}
        style={{ backgroundColor: item.swatch }}
      >
        <span className={cn('text-xs font-bold tabular-nums', luminance(item.swatch) > 0.6 ? 'text-black' : 'text-white')}>
          {item.swatch.toUpperCase()}
        </span>
      </div>
    );
  }

  if (item.preview) {
    return (
      <div
        className={cn(
          bleed,
          'flex h-40 items-center justify-center border-b border-gray-200 px-6',
          item.preview.dark ? 'bg-wehrli' : 'bg-white',
        )}
      >
        {/* Logos are SVG or PNG and must not be cropped: a plain img, contained in the area. */}
        <img src={item.preview.src} alt={item.preview.alt} className="h-auto max-h-28 w-4/5 object-contain" />
      </div>
    );
  }

  return null;
};

/** Card titles are h3 below the block title, h2 when the block has none. */
const CardBody: FC<{ item: CardItem; headingLevel: 'h2' | 'h3' }> = ({ item, headingLevel }) => {
  const Icon = item.icon ? CARD_ICONS[item.icon] : null;
  const content = (
    <>
      <CardMedia item={item} />
      {Icon ? (
        <span className="bg-wehrli-50 text-wehrli group-hover:bg-wehrli mb-5 flex size-12 items-center justify-center rounded-full transition-colors group-hover:text-white">
          <Icon className="size-6" aria-hidden="true" />
        </span>
      ) : null}
      {createElement(
        headingLevel,
        { className: 'text-wehrli mb-2 text-base font-bold break-words hyphens-auto' },
        item.title,
      )}
      {item.text ? <p className="text-sm text-black">{item.text}</p> : null}
      {item.link ? (
        <span className="text-wehrli mt-auto flex items-center gap-1.5 pt-5 text-sm font-bold">
          {item.link.label}
          <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </span>
      ) : null}
    </>
  );
  const className = 'card-surface flex w-full flex-col overflow-hidden p-6 lg:p-8';

  return item.link ? (
    <NextLink
      href={item.link.href}
      target={item.link.newTab ? '_blank' : undefined}
      rel={item.link.newTab ? 'noopener noreferrer' : undefined}
      className={cn(
        className,
        'group shadow-sm transition-[transform,box-shadow] hover:-translate-y-1 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0',
      )}
    >
      {content}
    </NextLink>
  ) : (
    <div className={cn(className, 'group shadow-sm')}>{content}</div>
  );
};
