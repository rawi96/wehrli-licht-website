import { GalleryBlockFragment } from '@/graphql/generated';
import NextLink from 'next/link';
import { FC, Suspense } from 'react';
import { SRCImage as DatoSRCImage } from 'react-datocms';
import { BlockWrapper } from '../block-wrapper';
import { Lightbox } from '../lightbox';

type Props = {
  block: GalleryBlockFragment;
};

export const GalleryBlock: FC<Props> = ({ block: { gallery } }) => {
  const slides = gallery.map(({ id, largeSize }) => ({
    key: id,
    src: largeSize.src,
    width: largeSize.width,
    height: largeSize.height,
  }));

  return (
    <BlockWrapper>
      <Suspense>
        <Lightbox slides={slides} />
      </Suspense>
      <div className="space-y-1 md:flex md:flex-wrap md:gap-1 md:space-y-0">
        {gallery.map(({ id, smallSize }) => {
          if (!smallSize) {
            return null;
          }

          return (
            <NextLink
              key={id}
              href={`?image=${id}`}
              scroll={false}
              className="relative block flex-grow md:h-[339px]"
              style={{ flexBasis: (smallSize.width / smallSize.height) * 339 }}
            >
              <DatoSRCImage data={smallSize} imgStyle={{ objectFit: 'cover', maxWidth: '100%', maxHeight: '100%' }} />
            </NextLink>
          );
        })}
      </div>
    </BlockWrapper>
  );
};
