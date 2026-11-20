import { Section, Grid } from '@wehrli/design-system';
import { TextThreeColsBlockFragment } from '@/graphql/generated';
import { isEmptyDocument } from 'datocms-structured-text-utils';
import { FC } from 'react';
import { StructuredTextRenderer } from '../dato-structured-text';

type Props = {
  block: TextThreeColsBlockFragment;
};

export const TextThreeColBlock: FC<Props> = ({
  block: { contentLeft, contentMiddle, contentRight, anchorId, disableMarginTop, disableMarginBottom },
}) => (
  <Section lead id={anchorId} marginTop={!disableMarginTop} marginBottom={!disableMarginBottom}>
    <Grid cols={3}>
      {!isEmptyDocument(contentLeft) && <StructuredTextRenderer data={contentLeft} />}
      {!isEmptyDocument(contentMiddle) && <StructuredTextRenderer data={contentMiddle} />}
      {!isEmptyDocument(contentRight) && <StructuredTextRenderer data={contentRight} />}
    </Grid>
  </Section>
);
