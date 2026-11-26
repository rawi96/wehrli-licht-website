import { FC, PropsWithChildren } from 'react';
import { cn } from '../../fundamentals/cn';

/** Columns of a card grid on large screens: always 4 (3 only where a block asks for it explicitly). */
export type GridColumns = 3 | 4;

/** Card grids always have 4 columns, so a single card or two never grow to half or full width. */
export const CARD_COLUMNS: GridColumns = 4;

/** Column classes per `GridColumns`: one column on phones, 2 on tablets, 3 or 4 from lg. */
export const GRID_COLUMN_CLASSES: Record<GridColumns, string> = {
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
};

type Props = PropsWithChildren<{
  /** Number of cards, or the number of text columns with `exact`. Card grids always get `CARD_COLUMNS`. */
  cols: number;
  /** Text columns: exactly `cols` columns from md, e.g. 2 for two text columns. */
  exact?: boolean;
}>;

/** Equal-height grid for cards and text columns. Works for any number of items. */
export const Grid: FC<Props> = ({ cols, exact, children }) => (
  <div
    className={cn(
      'my-8 grid grid-flow-row grid-cols-1 gap-4 md:auto-rows-fr md:gap-8 xl:my-16 xl:gap-12',
      exact ? (cols === 2 ? 'md:grid-cols-2' : cols >= 3 && 'md:grid-cols-3') : GRID_COLUMN_CLASSES[CARD_COLUMNS],
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
  /** 1 column, 2 from sm, 3 from lg */
  thirds: '(min-width: 1400px) 410px, (min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw',
  /** 1 column, 2 from sm, 4 from lg */
  quarters: '(min-width: 1400px) 300px, (min-width: 1024px) 23vw, (min-width: 640px) 46vw, 92vw',
  /** 1 column, 2 from md (Grid cols = 2) */
  halves: '(min-width: 1400px) 620px, (min-width: 768px) 46vw, 92vw',
  /** Text/image block: image column is basis-2/5 from md */
  twoFifths: '(min-width: 1400px) 500px, (min-width: 768px) 37vw, 92vw',
} as const;

/** `sizes` of a card image in a grid with `columns` columns. */
export const gridImageSizes = (columns: GridColumns = CARD_COLUMNS): string =>
  columns === 4 ? CONTENT_IMAGE_SIZES.quarters : CONTENT_IMAGE_SIZES.thirds;
