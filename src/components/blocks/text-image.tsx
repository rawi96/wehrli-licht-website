import { TextImageBlockFragment } from '@/graphql/generated';
import { classNames } from '@/utils/css';
import { StructuredText as StructuredTextType, isEmptyDocument } from 'datocms-structured-text-utils';
import { FC } from 'react';
import { BlockWrapper } from '../block-wrapper';
import { StructuredTextRenderer } from '../dato-structured-text';
import { ImageComponent } from '../image';

type Props = {
  block: TextImageBlockFragment;
};

export const TextImageBlock: FC<Props> = ({ block: { content, image, layout, anchorId } }) => (
  <BlockWrapper anchorId={anchorId}>
    <div
      className={classNames(
        'flex flex-col items-center gap-8 md:flex-row xl:gap-16',
        layout === 'image-right' && 'flex-col-reverse md:flex-row-reverse',
      )}
    >
      {image && (
        <div className={classNames('basis-2/5')}>
          <ImageComponent image={image} imgClassName={classNames('rounded', 'object-cover')} />
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
