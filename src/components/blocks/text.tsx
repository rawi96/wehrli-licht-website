import { TextBlockFragment } from '@/graphql/generated';
import { StructuredText as StructuredTextType, isEmptyDocument } from 'datocms-structured-text-utils';
import { FC } from 'react';
import { BlockWrapper } from '../block-wrapper';
import { StructuredTextRenderer } from '../dato-structured-text';

type Props = {
  block: TextBlockFragment;
};

export const TextBlock: FC<Props> = ({ block: { content } }) => (
  <BlockWrapper className="first-of-type:text-base lg:first-of-type:text-lg">
    {!isEmptyDocument(content) && <StructuredTextRenderer data={content as StructuredTextType} />}
  </BlockWrapper>
);
