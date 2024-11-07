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
              className="group relative block flex-grow text-center md:h-[339px]"
              style={{ flexBasis: (smallSize.width / smallSize.height) * 339 }}
            >
              <div className="absolute inset-0 bg-black opacity-40 transition-opacity duration-300 group-hover:opacity-60"></div>

              <h3 className="absolute inset-0 z-10 flex items-center justify-center text-lg font-semibold leading-6 text-white">
                <span>{smallSize.title}</span>
              </h3>

              {/* Image */}
              <DatoSRCImage data={smallSize} imgStyle={{ objectFit: 'cover', maxWidth: '100%', maxHeight: '100%' }} />
            </NextLink>
          );
        })}
      </div>
    </BlockWrapper>
  );
};
