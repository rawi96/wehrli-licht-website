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
  /** Aligns scroll row with viewport edges on small screens (parent uses w-11/12). */
  mobileEdgeBleed?: boolean;
};

export const ShopHorizontalScroll: FC<Props> = ({ ariaLabel, children, className, mobileEdgeBleed }) => (
  <div
    role="list"
    aria-label={ariaLabel}
    className={classNames(
      SCROLL_ROW_CLASS,
      mobileEdgeBleed
        ? 'relative -ml-[calc((100vw-100%)/2)] w-[100vw] max-w-[100vw] pr-4 pl-[calc((100vw-100%)/2)] sm:static sm:ml-0 sm:w-auto sm:max-w-none sm:px-0 sm:pr-0'
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
