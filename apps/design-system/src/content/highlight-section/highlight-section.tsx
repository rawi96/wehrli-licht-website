import { FC, ReactNode } from 'react';
import { Button } from '../../actions/button/button';
import { cn } from '../../fundamentals/cn';
import { Section } from '../../layout/section/section';
import { Heading } from '../../typography/heading/heading';

/**
 * Rendered image widths in the highlight teasers. Content is capped at 1280px (max-w-7xl) from 1400px viewports and is
 * 11/12 of the viewport below, so every entry has a px cap; plain vw values made wide screens download images up to 5x
 * larger than displayed.
 */
export const HIGHLIGHT_IMAGE_SIZES = {
  projectFeatured: '(min-width: 1400px) 750px, (min-width: 1024px) 58vw, 92vw',
  projectCompact: '(min-width: 1400px) 410px, (min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw',
  offerFeatured: '(min-width: 1400px) 640px, (min-width: 640px) 46vw, 92vw',
  offerCompact: '(min-width: 1400px) 310px, (min-width: 1024px) 23vw, 46vw',
  shopTileLarge: '(min-width: 1400px) 420px, (min-width: 1024px) 32vw, 92vw',
  shopTileSmall: '(min-width: 1400px) 300px, (min-width: 1024px) 22vw, 46vw',
} as const;

export type HighlightLink = {
  label: string;
  href: string;
  newTab?: boolean | null;
};

type BreakoutProps = {
  headingId: string;
  /** Background of the full-width band. */
  surface: 'light' | 'light-bordered' | 'brand';
  children: ReactNode;
};

/**
 * Full-width band out of the content column (100vw, centered on the column), with the content in the page width.
 * Shared by the highlight teaser blocks.
 */
export const HighlightBreakout: FC<BreakoutProps> = ({ headingId, surface, children }) => (
  <Section marginTop={false} marginBottom={false}>
    <section
      aria-labelledby={headingId}
      className={cn(
        'relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2',
        surface === 'brand' ? 'bg-wehrli text-white' : 'bg-white-200',
        surface === 'light-bordered' && 'border-b border-black/5',
      )}
    >
      <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:w-11/12 sm:px-0 sm:py-16 md:py-24">{children}</div>
    </section>
  </Section>
);

type Props = {
  /** Unique id of the block, for the heading id that labels the section. */
  id: string;
  title: string;
  subline: string;
  /** Hairline at the bottom, to separate it from a following band of the same color. */
  bordered?: boolean;
  /** Call to action below the content, full width on mobile. */
  cta: HighlightLink;
  children: ReactNode;
};

/** Light full-width band with heading, subline, content (cards) and a call to action. */
export const HighlightSection: FC<Props> = ({ id, title, subline, bordered, cta, children }) => {
  const headingId = `highlight-teaser-${id}`;

  return (
    <HighlightBreakout headingId={headingId} surface={bordered ? 'light-bordered' : 'light'}>
      <header className="mb-8 max-w-xl sm:mb-10 md:mb-12">
        <Heading level="2" id={headingId}>
          <span className="text-balance">{title}</span>
        </Heading>
        <p className="mt-3 text-sm leading-relaxed text-pretty text-gray-700 sm:text-base">{subline}</p>
      </header>

      {children}

      <footer className="mt-10 flex w-full justify-center *:w-full *:max-w-[22rem] sm:mt-14 sm:*:w-auto sm:*:max-w-none md:mt-16">
        <Button variant="primary" href={cta.href} showArrow={false} fullWidth newTab={!!cta.newTab}>
          {cta.label}
        </Button>
      </footer>
    </HighlightBreakout>
  );
};
