import { FC } from 'react';
import { Image, ImageData } from '../../content/image/image';
import { CONTENT_IMAGE_SIZES } from '../../layout/grid/grid';
import { Section } from '../../layout/section/section';
import type { BlockMargins } from '../block-margins';

type ImageItem = {
  id: string;
  image: ImageData;
  caption?: string | null;
};

type Props = BlockMargins & {
  images: ImageItem[];
  /** Loads the first image with priority (LCP). */
  priority?: boolean;
};

/** Images sit side by side from 640px (grid-flow-col), so each gets 1/n of the content width. */
const sideBySideImageSizes = (count: number): string =>
  `(min-width: 1400px) ${Math.round(1280 / count)}px, (min-width: 640px) ${Math.round(92 / count)}vw, 92vw`;

const Caption: FC<{ text?: string | null }> = ({ text }) => (text ? <p className="mt-2 text-sm italic">{text}</p> : null);

/** One image over the content width, or several side by side from 640px, each with an optional caption. */
export const ImageBlock: FC<Props> = ({ images, priority, marginTop, marginBottom }) => {
  if (images.length === 0) {
    return null;
  }

  if (images.length === 1) {
    const [{ image, caption }] = images;

    return (
      <Section marginBottom={marginBottom} marginTop={marginTop}>
        <Image image={image} priority={priority} sizes={CONTENT_IMAGE_SIZES.full} rounded="lg" />
        <Caption text={caption} />
      </Section>
    );
  }

  return (
    <Section marginBottom={marginBottom} marginTop={marginTop}>
      <div className="grid gap-2 sm:auto-cols-[minmax(0,_1fr)] sm:grid-flow-col sm:gap-8 xl:gap-16">
        {images.map(({ id, image, caption }, index) => (
          <div key={id}>
            <Image
              image={image}
              // Only the first image is the LCP candidate; the others must not compete with it.
              priority={priority && index === 0}
              sizes={sideBySideImageSizes(images.length)}
              rounded="lg"
            />
            <Caption text={caption} />
          </div>
        ))}
      </div>
    </Section>
  );
};
