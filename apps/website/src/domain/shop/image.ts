/**
 * A responsive image of the catalog: a resized `src` with its size and optionally `srcSet` and a blurred placeholder
 * (`base64`). Any image service can provide it; fields it does not have stay undefined.
 */
export type ResponsiveImage = {
  src: string;
  width: number;
  height?: number | null;
  alt?: string | null;
  title?: string | null;
  sizes?: string | null;
  srcSet?: string | null;
  webpSrcSet?: string | null;
  aspectRatio?: number;
  base64?: string | null;
  bgColor?: string | null;
};

/** A product or category image. */
export type CatalogImage = {
  /** The original file. */
  url: string;
  /** Alt text set where the image is used (e.g. on the product), else null. */
  alt: string | null;
  /** Title of the file. */
  title: string | null;
  /** Resized for the web; null if the file is not an image the service can resize. */
  responsive: ResponsiveImage | null;
};

/** URL of an image for SEO and feeds: the resized image, else the original file. */
export const imageUrl = (image: CatalogImage | null | undefined): string | undefined =>
  image ? (image.responsive?.src ?? image.url) : undefined;
