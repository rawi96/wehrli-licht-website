import { ImageGridBlockFragment } from '@/graphql/generated';
import { FC } from 'react';
import { BlockWrapper } from '../block-wrapper';
import { ImageComponent } from '../image';

type Props = {
  block: ImageGridBlockFragment;
};

export const ImageGridBlock: FC<Props> = ({ block: { image1, image2, image3 } }) => (
  <BlockWrapper>
    <div className="flex flex-col gap-8 sm:grid sm:grid-cols-2 sm:grid-rows-2 xl:gap-16">
      {image1 && (
        <div className="col-start-2 row-start-1">
          <ImageComponent image={image1} imgClassName="rounded w-full object-cover" />
        </div>
      )}
      {image2 && (
        <div className="col-start-2 row-start-2">
          <ImageComponent image={image2} imgClassName="rounded w-full object-cover" />
        </div>
      )}
      {image3 && (
        <div className="col-start-1 row-span-2 row-start-1">
          <ImageComponent image={image3} imgClassName="rounded h-full object-cover" />
        </div>
      )}
    </div>
  </BlockWrapper>
);
