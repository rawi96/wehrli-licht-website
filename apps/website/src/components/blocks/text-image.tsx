import { TextImageBlockFragment } from '@/graphql/generated';
import { toImage } from '@/utils/image';
import { TextImageBlock as TextImageBlockView } from '@wehrli/design-system';
import { isEmptyDocument } from 'datocms-structured-text-utils';
import { FC } from 'react';
import { StructuredTextRenderer } from '../dato-structured-text';

type Props = {
  block: TextImageBlockFragment;
  /** Block is near the top of the page: load its image eagerly (LCP). */
  aboveFold?: boolean;
};

export const TextImageBlock: FC<Props> = ({
  block: { content, image, layout, anchorId, disableMarginBottom, disableMarginTop },
  aboveFold = false,
}) => (
  <TextImageBlockView
    anchorId={anchorId}
    marginTop={!disableMarginTop}
    marginBottom={!disableMarginBottom}
    image={toImage(image)}
    layout={layout === 'image_right' ? 'image-right' : 'image-left'}
    priority={aboveFold}
    content={isEmptyDocument(content) ? null : <StructuredTextRenderer data={content} />}
  />
);
