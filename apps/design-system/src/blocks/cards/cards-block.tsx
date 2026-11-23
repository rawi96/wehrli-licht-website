import { ArrowRightIcon } from '@heroicons/react/20/solid';
import NextLink from 'next/link';
import { FC } from 'react';
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
};

type Props = BlockMargins & {
  title?: string | null;
  intro?: string | null;
  items: CardItem[];
  anchorId?: string | null;
};

const columns = (count: number) =>
  count === 4 ? 'md:grid-cols-2 xl:grid-cols-4' : count === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3';

/**
 * Short topics as cards with a symbol, e.g. the sub-pages of a hub or the strengths of a service. A card with a link
 * is clickable as a whole and lifts on hover.
 */
export const CardsBlock: FC<Props> = ({ title, intro, items, anchorId, marginTop, marginBottom }) => (
  <Section id={anchorId} scrollMargin marginTop={marginTop} marginBottom={marginBottom}>
    <BlockIntro title={title} intro={intro} />
    <ul className={cn('grid grid-cols-1 gap-4 lg:gap-6', columns(items.length))}>
      {items.map((item) => (
        <li key={item.id} className="flex">
          <CardBody item={item} />
        </li>
      ))}
    </ul>
  </Section>
);

const CardBody: FC<{ item: CardItem }> = ({ item }) => {
  const Icon = item.icon ? CARD_ICONS[item.icon] : null;
  const content = (
    <>
      {Icon ? (
        <span className="bg-wehrli-50 text-wehrli group-hover:bg-wehrli mb-5 flex size-12 items-center justify-center rounded-full transition-colors group-hover:text-white">
          <Icon className="size-6" aria-hidden="true" />
        </span>
      ) : null}
      <h3 className="text-wehrli mb-2 text-base font-bold">{item.title}</h3>
      {item.text ? <p className="text-sm text-black">{item.text}</p> : null}
      {item.link ? (
        <span className="text-wehrli mt-auto flex items-center gap-1.5 pt-5 text-sm font-bold">
          {item.link.label}
          <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </span>
      ) : null}
    </>
  );
  const className = 'flex w-full flex-col rounded-md bg-white p-6 lg:p-8';

  return item.link ? (
    <NextLink
      href={item.link.href}
      target={item.link.newTab ? '_blank' : undefined}
      className={cn(
        className,
        'group shadow-sm transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0',
      )}
    >
      {content}
    </NextLink>
  ) : (
    <div className={cn(className, 'group shadow-sm')}>{content}</div>
  );
};
