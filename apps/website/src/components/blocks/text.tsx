import { Section } from '@wehrli/design-system';
import { TextBlockFragment } from '@/graphql/generated';
import { isEmptyDocument } from 'datocms-structured-text-utils';
import { FC } from 'react';
import { StructuredTextRenderer } from '../dato-structured-text';

type Props = {
  block: TextBlockFragment;
};

export const TextBlock: FC<Props> = ({ block: { content, anchorId, disableMarginTop, disableMarginBottom } }) => (
  <Section lead id={anchorId} marginTop={!disableMarginTop} marginBottom={!disableMarginBottom}>
    {!isEmptyDocument(content) && <StructuredTextRenderer data={content} />}
  </Section>
);
