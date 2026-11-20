import { FC, ReactNode } from 'react';
import { Section } from '../../layout/section/section';
import type { BlockMargins } from '../block-margins';

type Props = BlockMargins & {
  /** Rich text (the website renders DatoCMS structured text). Nothing is rendered inside the section when empty. */
  content?: ReactNode;
  /** Anchor for in-page links. */
  anchorId?: string | null;
};

/** A rich text section. The first text block of a page is set larger (lead). */
export const TextBlock: FC<Props> = ({ content, anchorId, marginTop, marginBottom }) => (
  <Section lead id={anchorId} marginTop={marginTop} marginBottom={marginBottom}>
    {content}
  </Section>
);
