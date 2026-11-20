import { ImageBlockFragment } from '@/graphql/generated';
import { FC } from 'react';
import { BlockWrapper } from '../block-wrapper';
import { ImageComponent } from '../image';
import { CONTENT_IMAGE_SIZES } from '@/utils/image-sizes';

type Props = {
  block: ImageBlockFragment;
  aboveFold?: boolean;
};

/** Images sit side by side from 640px (grid-flow-col), so each gets 1/n of the content width. */
const sideBySideImageSizes = (count: number): string =>
  `(min-width: 1400px) ${Math.round(1280 / count)}px, (min-width: 640px) ${Math.round(92 / count)}vw, 92vw`;

export const ImageBlock: FC<Props> = ({
  block: { images, disableMarginBottom, disableMarginTop, priority: cmsPriority },
  aboveFold = false,
}) => {
  const priority = cmsPriority || aboveFold;

  if (images.length === 1) {
    const image = images[0];

    if (!image) {
      return null;
    }

    return (
      <BlockWrapper disableMarginBottom={disableMarginBottom} disableMarginTop={disableMarginTop}>
        <ImageComponent
          key={image.id}
          image={image}
          priority={priority}
          sizes={CONTENT_IMAGE_SIZES.full}
          altFromTitle={false}
          imgClassName="rounded object-cover"
        />
        {image?.title && <p className="mt-2 text-sm italic">{image.title}</p>}
      </BlockWrapper>
    );
  } else if (images.length > 1) {
    return (
      <BlockWrapper disableMarginBottom={disableMarginBottom} disableMarginTop={disableMarginTop}>
        <div className="grid gap-2 sm:auto-cols-[minmax(0,_1fr)] sm:grid-flow-col sm:gap-8 xl:gap-16">
          {images.map((image) => (
            <div key={image.id}>
              <ImageComponent
                key={image.id}
                image={image}
                priority={priority}
                sizes={sideBySideImageSizes(images.length)}
                altFromTitle={false}
                imgClassName="rounded object-cover"
              />
              {image?.title && <p className="mt-2 text-sm italic">{image.title}</p>}
            </div>
          ))}
        </div>
      </BlockWrapper>
    );
  }
};
