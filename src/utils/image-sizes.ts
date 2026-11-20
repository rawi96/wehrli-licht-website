/**
 * `sizes` values for the shared content layout: the content is 11/12 of the viewport and capped at
 * 1280px (max-w-7xl) from 1400px viewports. Keeping a px cap matters: plain vw values make wide
 * screens download images several times larger than they are displayed.
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

export const gridImageSizes = (cols: number): string => {
  if (cols >= 3) {
    return CONTENT_IMAGE_SIZES.thirds;
  }

  return cols === 2 ? CONTENT_IMAGE_SIZES.halves : CONTENT_IMAGE_SIZES.full;
};
