import { ImageBlockFragment } from '@/graphql/generated';
import { FC } from 'react';
import { BlockWrapper } from '../block-wrapper';
import { ImageComponent } from '../image';

type Props = {
  block: ImageBlockFragment;
};

export const ImageBlock: FC<Props> = ({ block: { images, disableMarginBottom, disableMarginTop } }) => {
  if (images.length === 1) {
    const image = images[0];

    if (!image) {
      return null;
    }

    return (
      <BlockWrapper disableMarginBottom={disableMarginBottom} disableMarginTop={disableMarginTop}>
        <ImageComponent key={image.id} image={image} imgClassName="rounded object-cover" />
        {image?.title && <p className="mt-2 text-sm italic">{image.title}</p>}
      </BlockWrapper>
    );
  } else if (images.length > 1) {
    return (
      <BlockWrapper disableMarginBottom={disableMarginBottom} disableMarginTop={disableMarginTop}>
        <div className="grid gap-2 sm:auto-cols-[minmax(0,_1fr)] sm:grid-flow-col sm:gap-8 xl:gap-16">
          {images.map((image) => (
            <div key={image.id}>
              <ImageComponent key={image.id} image={image} imgClassName="rounded object-cover" />
              {image?.title && <p className="mt-2 text-sm italic">{image.title}</p>}
            </div>
          ))}
        </div>
      </BlockWrapper>
    );
  }
};
