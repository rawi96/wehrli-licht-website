import { TextImageBlockFragment } from '@/graphql/generated';
import { classNames } from '@/utils/css';
import { StructuredText as StructuredTextType, isEmptyDocument } from 'datocms-structured-text-utils';
import NextImage from 'next/image';
import { FC } from 'react';
import { BlockWrapper } from '../block-wrapper';
import { StructuredTextRenderer } from '../dato-structured-text';
import { ImageComponent } from '../image';

type Props = {
  block: TextImageBlockFragment;
};

export const TextImageBlock: FC<Props> = ({
  block: { content, image, layout, anchorId, disableMarginBottom, disableMarginTop },
}) => (
  <BlockWrapper anchorId={anchorId} disableMarginBottom={disableMarginBottom} disableMarginTop={disableMarginTop}>
    <div
      className={classNames(
        'flex flex-col items-center gap-8 md:flex-row xl:gap-16',
        layout === 'image_right' && 'flex-col-reverse md:flex-row-reverse',
      )}
    >
      {image && (
        <div className={classNames('basis-2/5')}>
          {image.responsiveImage?.src ? (
            <NextImage
              src={image.responsiveImage.src}
              width={image.responsiveImage.width ?? 672}
              height={image.responsiveImage.height ?? 504}
              sizes={image.responsiveImage.sizes ?? '(max-width: 768px) 100vw, 40vw'}
              alt={image.responsiveImage.alt ?? ''}
              priority
              fetchPriority="high"
              className={classNames('rounded', 'object-cover')}
              style={{ width: '100%', height: '100%' }}
            />
          ) : (
            <ImageComponent image={image} priority imgClassName={classNames('rounded', 'object-cover')} />
          )}
        </div>
      )}
      {!isEmptyDocument(content) && (
        <div className={classNames('basis-3/5')}>
          <StructuredTextRenderer data={content as StructuredTextType} />
        </div>
      )}
    </div>
  </BlockWrapper>
);
