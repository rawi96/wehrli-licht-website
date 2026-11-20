import { FC, ReactNode } from 'react';
import { Section } from '../../layout/section/section';
import { Heading } from '../../typography/heading/heading';
import type { BlockMargins } from '../block-margins';

type Props = BlockMargins & {
  /** Anchor, so links can jump straight to the form. */
  anchorId: string;
  title?: string | null;
  /** Text above the form, line breaks are kept. */
  intro?: string | null;
  /** The form, usually `ContactForm` (the website connects it to its API). */
  children: ReactNode;
};

/** A narrow column with heading, intro and the contact form. Clear of the sticky header when jumped to. */
export const ContactFormBlock: FC<Props> = ({ anchorId, title, intro, children, marginTop, marginBottom }) => (
  <Section scrollMargin id={anchorId} marginTop={marginTop} marginBottom={marginBottom}>
    <div className="mx-auto max-w-3xl px-4 lg:px-0">
      {title && <Heading level="2">{title}</Heading>}
      {intro && <p className="mb-8 text-base whitespace-pre-line">{intro}</p>}
      {children}
    </div>
  </Section>
);
