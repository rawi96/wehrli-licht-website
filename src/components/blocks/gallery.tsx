import { GalleryBlockFragment } from '@/graphql/generated';
import { classNames } from '@/utils/css';
import NextLink from 'next/link';
import { FC, Suspense } from 'react';
import { SRCImage as DatoSRCImage } from 'react-datocms';
import { BlockWrapper } from '../block-wrapper';
import { Lightbox } from '../lightbox';

type Props = {
  block: GalleryBlockFragment;
};

export const GalleryBlock: FC<Props> = ({ block: { gallery, disableMarginBottom, disableMarginTop, showImageTitles } }) => {
  const slides = gallery.map(({ id, largeSize }) => ({
    key: id,
    src: largeSize.src,
    width: largeSize.width,
    height: largeSize.height,
  }));

  return (
    <BlockWrapper disableMarginBottom={disableMarginBottom} disableMarginTop={disableMarginTop}>
      <Suspense>
        <Lightbox slides={slides} />
      </Suspense>
      <div className="space-y-1 md:flex md:flex-wrap md:gap-1 md:space-y-0">
        {gallery.map(({ id, smallSize }) => {
          if (!smallSize) {
            return null;
          }

          const [smallTitle, mainTitle] = (smallSize.title ?? '').split('-').map((part) => part.trim());

          return (
            <NextLink
              key={id}
              href={`?image=${id}`}
              scroll={false}
              className="group relative block flex-grow overflow-hidden text-center md:h-[339px]"
              style={{ flexBasis: (smallSize.width / smallSize.height) * 339 }}
            >
              {showImageTitles && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-base font-bold text-white transition-opacity duration-300 group-hover:opacity-100">
                  {smallTitle && <span className="text-sm">{smallTitle}</span>}
                  {mainTitle && <h3 className="text-lg">{mainTitle}</h3>}
                </div>
              )}

              <DatoSRCImage
                data={smallSize}
                imgStyle={{ objectFit: 'cover', maxWidth: '100%', maxHeight: '100%' }}
                imgClassName={classNames(
                  'transition-transform duration-300 group-hover:scale-110',
                  showImageTitles && 'brightness-75',
                )}
              />
            </NextLink>
          );
        })}
      </div>
    </BlockWrapper>
  );
};
