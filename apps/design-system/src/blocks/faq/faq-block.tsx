import { FC } from 'react';
import { FaqAccordion } from '../../content/faq-accordion/faq-accordion';
import { Section } from '../../layout/section/section';
import { SectionHeading } from '../../layout/section-heading/section-heading';
import type { BlockMargins } from '../block-margins';

export type FaqBlockItem = {
  id: string;
  question: string;
  /** Plain text; line breaks are kept. */
  answer: string;
};

type Props = BlockMargins & {
  /** Defaults to «Häufige Fragen». */
  title?: string | null;
  intro?: string | null;
  items: FaqBlockItem[];
  /** Link to the page with all questions. */
  allFaqsLink?: { label: string; href: string } | null;
};

/**
 * Questions and answers of a page: title with the link to all questions at the right (like other card sections), the
 * questions as an accordion across the column. Answers stay in the document when closed (search engines).
 */
export const FaqBlock: FC<Props> = ({ title, intro, items, allFaqsLink, marginTop, marginBottom }) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <Section marginTop={marginTop} marginBottom={marginBottom}>
      <SectionHeading title={title?.trim() ? title.trim() : 'Häufige Fragen'} link={allFaqsLink} />
      {intro && <p className="mb-6 max-w-3xl text-sm text-black">{intro}</p>}
      <FaqAccordion items={items} />
    </Section>
  );
};
