import { FC, PropsWithChildren } from 'react';
import { cn } from '../../fundamentals/cn';

type Props = PropsWithChildren<{
  /** Number of items, or the wanted columns: 1 column on mobile, 2 from md, 3 from lg (when 3 or more). */
  cols: number;
}>;

/** Equal-height grid for cards and text columns. Works for any number of items. */
export const Grid: FC<Props> = ({ cols, children }) => (
  <div
    className={cn(
      'my-8 grid grid-flow-row grid-cols-1 gap-4 md:auto-rows-fr md:gap-8 xl:my-16 xl:gap-16',
      cols === 2 ? 'md:grid-cols-2' : cols >= 3 ? 'md:grid-cols-2 lg:grid-cols-3' : undefined,
    )}
  >
    {children}
  </div>
);

/**
 * `sizes` for images in the content column: 11/12 of the viewport, capped at 1280px from 1400px viewports.
 * Keep a px cap: plain vw values make wide screens download images several times larger than shown.
 */
export const CONTENT_IMAGE_SIZES = {
  full: '(min-width: 1400px) 1280px, 92vw',
  /** 1 column, 2 from md, 3 from lg (Grid cols >= 3) */
  thirds: '(min-width: 1400px) 410px, (min-width: 1024px) 30vw, (min-width: 768px) 46vw, 92vw',
  /** 1 column, 2 from md (Grid cols = 2) */
  halves: '(min-width: 1400px) 620px, (min-width: 768px) 46vw, 92vw',
  /** Text/image block: image column is basis-2/5 from md */
  twoFifths: '(min-width: 1400px) 500px, (min-width: 768px) 37vw, 92vw',
} as const;

/** `sizes` of an image in a Grid with `cols` columns. */
export const gridImageSizes = (cols: number): string => {
  if (cols >= 3) {
    return CONTENT_IMAGE_SIZES.thirds;
  }

  return cols === 2 ? CONTENT_IMAGE_SIZES.halves : CONTENT_IMAGE_SIZES.full;
};
