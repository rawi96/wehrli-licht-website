import { TextTwoColsBlockFragment } from '@/graphql/generated';
import { TextTwoColumnsBlock } from '@wehrli/design-system';
import { isEmptyDocument } from 'datocms-structured-text-utils';
import { FC } from 'react';
import { StructuredTextRenderer } from '../dato-structured-text';

type Props = {
  block: TextTwoColsBlockFragment;
};

export const TextTwoColBlock: FC<Props> = ({
  block: { contentLeft, contentRight, anchorId, disableMarginTop, disableMarginBottom },
}) => (
  <TextTwoColumnsBlock
    anchorId={anchorId}
    marginTop={!disableMarginTop}
    marginBottom={!disableMarginBottom}
    left={!isEmptyDocument(contentLeft) && <StructuredTextRenderer data={contentLeft} />}
    right={!isEmptyDocument(contentRight) && <StructuredTextRenderer data={contentRight} />}
  />
);
