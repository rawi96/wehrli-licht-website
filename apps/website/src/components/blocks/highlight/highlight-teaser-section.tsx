import { BlockWrapper } from '@/components/block-wrapper';
import { Heading } from '@/components/nodes/heading';
import { classNames } from '@/utils/css';
import { ReactNode } from 'react';

type Props = {
  blockId: string;
  title: string;
  subline: string;
  disableMarginTop?: boolean;
  disableMarginBottom?: boolean;
  bordered?: boolean;
  footer: ReactNode;
  children: ReactNode;
};

export const HighlightTeaserSection = ({
  blockId,
  title,
  subline,
  disableMarginTop,
  disableMarginBottom,
  bordered,
  footer,
  children,
}: Props) => {
  const headingId = `highlight-teaser-${blockId}`;

  return (
    <BlockWrapper disableMarginTop={disableMarginTop} disableMarginBottom={disableMarginBottom} className="!my-0">
      <section
        aria-labelledby={headingId}
        className={classNames('highlight-teaser-breakout bg-white-200', bordered && 'border-b border-black/5')}
      >
        <div className="highlight-teaser-container py-12 sm:py-16 md:py-24">
          <header className="mb-8 max-w-xl sm:mb-10 md:mb-12">
            <Heading level="2" id={headingId}>
              <span className="text-balance">{title}</span>
            </Heading>
            <p className="mt-3 text-sm leading-relaxed text-pretty text-gray-700 sm:text-base">{subline}</p>
          </header>

          {children}

          <footer className="highlight-teaser-cta-footer mt-10 sm:mt-14 md:mt-16">{footer}</footer>
        </div>
      </section>
    </BlockWrapper>
  );
};
