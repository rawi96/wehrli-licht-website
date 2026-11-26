import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import NextLink from 'next/link';
import { FC } from 'react';
import { cn } from '../../fundamentals/cn';
import { Card } from '../../content/card/card';
import { CARD_COLUMNS, GRID_COLUMN_CLASSES, gridImageSizes } from '../../layout/grid/grid';
import { Section } from '../../layout/section/section';
import { SectionHeading } from '../../layout/section-heading/section-heading';
import type { ChildPage } from '../child-pages/child-pages-block';

type Props = {
  /** Heading above the related pages, e.g. «Mehr zum Thema Leistungen». */
  title: string;
  /** The other pages below the same parent. */
  pages: ChildPage[];
  /** The parent page, linked as «Zurück zu …». */
  back: { label: string; href: string };
  /** Last element of the page: the band runs into the footer (cancels the page column's bottom margin). */
  last?: boolean;
};

const BackLink: FC<{ back: Props['back']; className?: string }> = ({ back, className }) => (
  <NextLink
    href={back.href}
    className={cn(
      'text-wehrli hover:text-wehrli-dark inline-flex items-center gap-2 text-sm font-bold no-underline',
      className,
    )}
  >
    <ArrowLeftIcon aria-hidden className="h-4 w-4" />
    Zurück zu {back.label}
  </NextLink>
);

/**
 * End of a detail page: the pages next to it as cards and a link back to their overview, so a visitor can go on or
 * up one level. Without other pages only the way back is shown.
 */
export const RelatedPagesBlock: FC<Props> = ({ title, pages, back, last = false }) => (
  <Section marginBottom={!last}>
    {/* Light blue band across the full width, like the head of areas and overviews; the content stays in the column. */}
    <div className={cn('band-wehrli-50 py-12 lg:py-16', last && '-mb-24 md:-mb-36')}>
      {pages.length > 0 ? (
        <>
          <SectionHeading title={title} link={{ label: `Zurück zu ${back.label}`, href: back.href }} back />
          <div className={cn('grid gap-5 lg:gap-6', GRID_COLUMN_CLASSES[CARD_COLUMNS])}>
            {pages.map((page) => (
              <Card
                key={page.id}
                title={page.title}
                eyebrow={page.eyebrow}
                description={page.description}
                href={page.href}
                linkLabel={page.linkLabel}
                image={page.image}
                imageSizes={gridImageSizes()}
                headingLevel="h3"
              />
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-base font-bold text-black">{title}</p>
          <BackLink back={back} />
        </div>
      )}
    </div>
  </Section>
);
