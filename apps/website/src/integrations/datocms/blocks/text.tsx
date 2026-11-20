import { TextBlockFragment } from '@/graphql/generated';
import { TextBlock as TextBlockView } from '@wehrli/design-system';
import { isEmptyDocument } from 'datocms-structured-text-utils';
import { FC } from 'react';
import { StructuredTextRenderer } from './structured-text';

type Props = {
  block: TextBlockFragment;
};

export const TextBlock: FC<Props> = ({ block: { content, anchorId, disableMarginTop, disableMarginBottom } }) => (
  <TextBlockView
    anchorId={anchorId}
    marginTop={!disableMarginTop}
    marginBottom={!disableMarginBottom}
    content={!isEmptyDocument(content) && <StructuredTextRenderer data={content} />}
  />
);
