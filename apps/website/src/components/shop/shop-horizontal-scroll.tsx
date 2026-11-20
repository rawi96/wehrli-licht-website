import { classNames } from '@/utils/css';
import { FC, ReactNode } from 'react';

const SCROLL_ROW_CLASS = classNames(
  'flex items-stretch gap-3 overflow-x-auto overscroll-x-contain scroll-smooth pb-2 snap-x snap-mandatory sm:gap-4',
  '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
);

type Props = {
  ariaLabel: string;
  children: ReactNode;
  className?: string;
  /**
   * Aligns scroll row with viewport edges on small screens. The parent uses w-11/12, so the gutter
   * is 100vw/24. Margin, padding and scroll-padding must share that value: if padding and
   * scroll-padding differ, the browser snap-scrolls the row on load (stops Chrome's LCP).
   */
  mobileEdgeBleed?: boolean;
};

export const ShopHorizontalScroll: FC<Props> = ({ ariaLabel, children, className, mobileEdgeBleed }) => (
  <div
    role="list"
    aria-label={ariaLabel}
    className={classNames(
      SCROLL_ROW_CLASS,
      mobileEdgeBleed
        ? 'relative -ml-[calc(100vw/24)] w-[100vw] max-w-[100vw] scroll-pl-[calc(100vw/24)] pr-4 pl-[calc(100vw/24)] sm:static sm:ml-0 sm:w-auto sm:max-w-none sm:scroll-pl-0 sm:px-0 sm:pr-0'
        : '-mx-1 px-1',
      className,
    )}
  >
    {children}
  </div>
);

export const ShopHorizontalScrollItem: FC<{ children: ReactNode }> = ({ children }) => (
  <div role="listitem" className="flex shrink-0 snap-start snap-always">
    {children}
  </div>
);
