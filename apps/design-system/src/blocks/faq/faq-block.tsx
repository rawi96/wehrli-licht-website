import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { FC } from 'react';
import { FaqAccordion } from '../../content/faq/faq-accordion';
import { Section } from '../../layout/section/section';
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
  labels?: { eyebrow?: string };
};

/**
 * Questions and answers of a page, set apart from the content as a card: title, intro and a link to all questions
 * on the left, the questions as an accordion on the right. Answers stay in the document when closed (search engines).
 */
export const FaqBlock: FC<Props> = ({ title, intro, items, allFaqsLink, labels, marginTop, marginBottom }) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <Section marginTop={marginTop} marginBottom={marginBottom}>
      <div className="bg-wehrli-50 grid gap-8 rounded-md p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-12 lg:p-12">
        <div className="flex flex-col gap-4">
          <p className="text-wehrli text-xs font-bold">{labels?.eyebrow ?? 'FAQ'}</p>
          <h2 className="text-wehrli text-lg font-bold break-words md:text-xl">{title?.trim() ?? 'Häufige Fragen'}</h2>
          {intro && <p className="text-sm text-gray-600">{intro}</p>}
          {allFaqsLink && (
            <Link
              href={allFaqsLink.href}
              className="group text-wehrli mt-auto inline-flex items-center gap-x-2 self-start text-sm font-bold hover:underline"
            >
              {allFaqsLink.label}
              <ArrowRightIcon
                className="size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
                aria-hidden="true"
              />
            </Link>
          )}
        </div>

        <FaqAccordion items={items} />
      </div>
    </Section>
  );
};
