import { Section, Grid } from '@wehrli/design-system';
import { TextTwoColsBlockFragment } from '@/graphql/generated';
import { isEmptyDocument } from 'datocms-structured-text-utils';
import { FC } from 'react';
import { StructuredTextRenderer } from '../dato-structured-text';

type Props = {
  block: TextTwoColsBlockFragment;
};

export const TextTwoColBlock: FC<Props> = ({
  block: { contentLeft, contentRight, anchorId, disableMarginTop, disableMarginBottom },
}) => (
  <Section lead id={anchorId} marginTop={!disableMarginTop} marginBottom={!disableMarginBottom}>
    <Grid cols={2}>
      {!isEmptyDocument(contentLeft) && <StructuredTextRenderer data={contentLeft} />}
      {!isEmptyDocument(contentRight) && <StructuredTextRenderer data={contentRight} />}
    </Grid>
  </Section>
);
