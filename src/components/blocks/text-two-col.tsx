import { TextTwoColsBlockFragment } from '@/graphql/generated';
import { StructuredText as StructuredTextType, isEmptyDocument } from 'datocms-structured-text-utils';
import { FC } from 'react';
import { BlockWrapper } from '../block-wrapper';
import { StructuredTextRenderer } from '../dato-structured-text';
import { Grid } from '../grid';

type Props = {
  block: TextTwoColsBlockFragment;
};

export const TextTwoColBlock: FC<Props> = ({
  block: { contentLeft, contentRight, anchorId, disableMarginTop, disableMarginBottom },
}) => (
  <BlockWrapper
    className="first-of-type:text-base lg:first-of-type:text-lg"
    anchorId={anchorId}
    disableMarginTop={disableMarginTop}
    disableMarginBottom={disableMarginBottom}
  >
    <Grid cols={2}>
      {!isEmptyDocument(contentLeft) && <StructuredTextRenderer data={contentLeft as StructuredTextType} />}
      {!isEmptyDocument(contentRight) && <StructuredTextRenderer data={contentRight as StructuredTextType} />}
    </Grid>
  </BlockWrapper>
);
