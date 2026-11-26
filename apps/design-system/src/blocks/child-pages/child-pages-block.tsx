import { ChevronRightIcon } from '@heroicons/react/20/solid';
import NextLink from 'next/link';
import { createElement, FC } from 'react';
import { cn } from '../../fundamentals/cn';
import { Card } from '../../content/card/card';
import { Image, ImageData } from '../../content/image/image';
import { CARD_COLUMNS, GRID_COLUMN_CLASSES, gridImageSizes, type GridColumns } from '../../layout/grid/grid';
import { Section } from '../../layout/section/section';
import { Heading } from '../../typography/heading/heading';

export type ChildPage = {
  id: string;
  title: string;
  eyebrow?: string | null;
  description?: string | null;
  href: string;
  linkLabel: string;
  image?: ImageData | null;
  /** Its own sub-pages, listed as links on `topics` cards. */
  children?: { id: string; title: string; href: string }[];
};

type Props = {
  /**
   * `topics`: one large card per sub-page with its own sub-pages as links (area pages). `cards`: teaser cards
   * (overview pages, and related pages below a detail page).
   */
  variant: 'topics' | 'cards';
  pages: ChildPage[];
  title?: string | null;
  /** Columns from lg; `CARD_COLUMNS` (4) by default. */
  columns?: GridColumns;
};

const TopicCard: FC<{ page: ChildPage; imageSizes: string; headingLevel: 'h2' | 'h3' }> = ({
  page,
  imageSizes,
  headingLevel,
}) => (
  <article className="card-surface group/topic flex flex-col overflow-hidden">
    <NextLink href={page.href} className="relative block aspect-[16/9] overflow-hidden" tabIndex={-1} aria-hidden>
      <Image image={page.image} sizes={imageSizes} hoverZoom absolute />
    </NextLink>
    <div className="flex flex-1 flex-col p-5 lg:p-6">
      {page.eyebrow && <p className="text-xs font-bold text-gray-600">{page.eyebrow}</p>}
      {createElement(
        headingLevel,
        { className: 'text-wehrli mt-2 text-base font-bold break-words hyphens-auto lg:text-lg' },
        <NextLink href={page.href} className="hover:text-wehrli-dark no-underline">
          {page.title}
        </NextLink>,
      )}
      {page.description && <p className="mt-3 text-sm text-black">{page.description}</p>}
      {page.children && page.children.length > 0 && (
        <ul className="mt-5 list-none divide-y divide-gray-200 border-y border-gray-200 p-0">
          {page.children.map((child) => (
            <li key={child.id}>
              <NextLink
                href={child.href}
                className="text-wehrli hover:bg-wehrli-50 flex items-center justify-between gap-3 px-1 py-2.5 text-xs font-bold no-underline transition-colors"
              >
                {child.title}
                <ChevronRightIcon aria-hidden className="h-5 w-5 shrink-0" />
              </NextLink>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-auto pt-6">
        <NextLink
          href={page.href}
          className="text-wehrli border-wehrli hover:text-wehrli-dark hover:border-wehrli-dark border-b-2 text-sm font-bold no-underline transition-colors"
        >
          {page.linkLabel}
          {/* «Mehr erfahren» on every card: the title makes each link unique for screen readers and search. */}
          <span className="sr-only">: {page.title}</span>
        </NextLink>
      </div>
    </div>
  </article>
);

/** The sub-pages of a page, from their preview fields. Renders nothing without pages. */
export const ChildPagesBlock: FC<Props> = ({ variant, pages, title, columns = CARD_COLUMNS }) => {
  if (pages.length === 0) {
    return null;
  }

  // Card titles are h3 below the block title, h2 when the cards follow the page title directly.
  const headingLevel = title ? 'h3' : 'h2';
  const grid = cn('grid gap-5 lg:gap-6', GRID_COLUMN_CLASSES[columns], title ? 'mt-2' : undefined);

  return (
    <Section marginTop={false}>
      {title && <Heading level="2">{title}</Heading>}
      {variant === 'topics' ? (
        <div className={grid}>
          {pages.map((page) => (
            <TopicCard key={page.id} page={page} imageSizes={gridImageSizes(columns)} headingLevel={headingLevel} />
          ))}
        </div>
      ) : (
        <div className={grid}>
          {pages.map((page) => (
            <Card
              key={page.id}
              title={page.title}
              eyebrow={page.eyebrow}
              description={page.description}
              href={page.href}
              linkLabel={page.linkLabel}
              image={page.image}
              imageSizes={gridImageSizes(columns)}
              headingLevel={headingLevel}
            />
          ))}
        </div>
      )}
    </Section>
  );
};
