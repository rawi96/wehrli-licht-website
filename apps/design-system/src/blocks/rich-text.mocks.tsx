import { Heading } from '../typography/heading/heading';
import { Paragraph, RichText } from '../typography/rich-text/rich-text';
import { MOCK_TEXT } from './blocks.mocks';

/** Rich text as the website renders it from DatoCMS structured text, for block stories. */
export const mockRichText = (heading?: string, paragraphs = 1) => (
  <RichText>
    {heading && <Heading level="2">{heading}</Heading>}
    {Array.from({ length: paragraphs }, (_, index) => (
      <Paragraph key={index}>{MOCK_TEXT}</Paragraph>
    ))}
  </RichText>
);
