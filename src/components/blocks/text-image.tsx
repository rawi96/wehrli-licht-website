import { TextImageBlockFragment } from '@/graphql/generated';
import { classNames } from '@/utils/css';
import { StructuredText as StructuredTextType, isEmptyDocument } from 'datocms-structured-text-utils';
import { FC } from 'react';
import { SRCImage as DatoSRCImage } from 'react-datocms';
import { BlockWrapper } from '../block-wrapper';
import { StructuredTextRenderer } from '../dato-structured-text';

type Props = {
  block: TextImageBlockFragment;
};

export const TextImageBlock: FC<Props> = ({ block: { content, image, layout } }) => (
  <BlockWrapper>
    <div className="grid items-center gap-8 md:grid-cols-2 lg:gap-12">
      {!isEmptyDocument(content) && (
        <div className={classNames(layout === 'image_left' && 'order-last')}>
          <StructuredTextRenderer data={content as StructuredTextType} />
        </div>
      )}
      {image?.responsiveImage && (
        <DatoSRCImage
          data={image.responsiveImage}
          imgStyle={{ maxWidth: '100%', height: '100%', width: '100%', objectFit: 'cover' }}
        />
      )}
    </div>
  </BlockWrapper>
);
