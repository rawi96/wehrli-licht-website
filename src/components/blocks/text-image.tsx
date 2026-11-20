import { TextImageBlockFragment } from '@/graphql/generated';
import { classNames } from '@/utils/css';
import { isEmptyDocument } from 'datocms-structured-text-utils';
import { FC } from 'react';
import { BlockWrapper } from '../block-wrapper';
import { StructuredTextRenderer } from '../dato-structured-text';
import { ImageComponent } from '../image';
import { CONTENT_IMAGE_SIZES } from '@/utils/image-sizes';

type Props = {
  block: TextImageBlockFragment;
  /** Block is near the top of the page: load its image eagerly (LCP). */
  aboveFold?: boolean;
};

export const TextImageBlock: FC<Props> = ({
  block: { content, image, layout, anchorId, disableMarginBottom, disableMarginTop },
  aboveFold = false,
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
          <ImageComponent
            image={image}
            priority={aboveFold}
            sizes={CONTENT_IMAGE_SIZES.twoFifths}
            imgClassName={classNames('rounded', 'object-cover')}
          />
        </div>
      )}
      {!isEmptyDocument(content) && (
        <div className={classNames('basis-3/5')}>
          <StructuredTextRenderer data={content} />
        </div>
      )}
    </div>
  </BlockWrapper>
);
