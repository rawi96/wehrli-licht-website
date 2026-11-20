import { TextThreeColsBlockFragment } from '@/graphql/generated';
import { TextThreeColumnsBlock } from '@wehrli/design-system';
import { isEmptyDocument } from 'datocms-structured-text-utils';
import { FC } from 'react';
import { StructuredTextRenderer } from '../dato-structured-text';

type Props = {
  block: TextThreeColsBlockFragment;
};

export const TextThreeColBlock: FC<Props> = ({
  block: { contentLeft, contentMiddle, contentRight, anchorId, disableMarginTop, disableMarginBottom },
}) => (
  <TextThreeColumnsBlock
    anchorId={anchorId}
    marginTop={!disableMarginTop}
    marginBottom={!disableMarginBottom}
    left={!isEmptyDocument(contentLeft) && <StructuredTextRenderer data={contentLeft} />}
    middle={!isEmptyDocument(contentMiddle) && <StructuredTextRenderer data={contentMiddle} />}
    right={!isEmptyDocument(contentRight) && <StructuredTextRenderer data={contentRight} />}
  />
);
