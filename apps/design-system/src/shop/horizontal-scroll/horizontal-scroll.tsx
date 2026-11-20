import { FC, ReactNode } from 'react';
import { cn } from '../../fundamentals/cn';

type Props = {
  /** Accessible name of the list. */
  label: string;
  children: ReactNode;
  /** Space above the row (32px, 40px from sm), e.g. below a section header. */
  spaced?: boolean;
  /**
   * Aligns the row with the viewport edges on small screens. The parent uses w-11/12, so the gutter is 100vw/24.
   * Margin, padding and scroll-padding must share that value: if padding and scroll-padding differ, the browser
   * snap-scrolls the row on load (stops Chrome's LCP).
   */
  mobileEdgeBleed?: boolean;
};

/** A horizontally scrolling row of cards with snap points and a hidden scrollbar. Children are HorizontalScrollItems. */
export const HorizontalScroll: FC<Props> = ({ label, children, spaced, mobileEdgeBleed }) => (
  <div
    role="list"
    aria-label={label}
    className={cn(
      'flex snap-x snap-mandatory items-stretch gap-3 overflow-x-auto overscroll-x-contain scroll-smooth pb-2 sm:gap-4',
      '[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
      mobileEdgeBleed
        ? 'relative -ml-[calc(100vw/24)] w-[100vw] max-w-[100vw] scroll-pl-[calc(100vw/24)] pr-4 pl-[calc(100vw/24)] sm:static sm:ml-0 sm:w-auto sm:max-w-none sm:scroll-pl-0 sm:px-0 sm:pr-0'
        : '-mx-1 px-1',
      spaced && 'mt-8 sm:mt-10',
    )}
  >
    {children}
  </div>
);

export const HorizontalScrollItem: FC<{ children: ReactNode }> = ({ children }) => (
  <div role="listitem" className="flex shrink-0 snap-start snap-always">
    {children}
  </div>
);
