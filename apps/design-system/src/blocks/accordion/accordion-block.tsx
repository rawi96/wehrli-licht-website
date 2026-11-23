'use client';

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { FC, ReactNode } from 'react';
import { Section } from '../../layout/section/section';
import type { BlockMargins } from '../block-margins';
import { BlockIntro } from '../block-intro';

export type AccordionItem = {
  id: string;
  title: string;
  /** Rich text (the website renders DatoCMS structured text). */
  content: ReactNode;
};

type Props = BlockMargins & {
  title?: string | null;
  intro?: string | null;
  items: AccordionItem[];
  /** The first section starts open. */
  openFirst?: boolean;
  anchorId?: string | null;
};

/**
 * Longer content folded into sections that open on click, so a page stays short and easy to scan. Closed sections
 * stay in the document, so search engines read them.
 */
export const AccordionBlock: FC<Props> = ({ title, intro, items, openFirst = false, anchorId, marginTop, marginBottom }) => (
  <Section id={anchorId} scrollMargin marginTop={marginTop} marginBottom={marginBottom}>
    <BlockIntro title={title} intro={intro} />
    <div className="card-surface divide-y divide-gray-200">
      {items.map((item, index) => (
        <Disclosure key={item.id} as="div" defaultOpen={openFirst && index === 0}>
          <DisclosureButton className="group flex w-full items-center justify-between gap-6 px-6 py-5 text-left focus-visible:-outline-offset-4 lg:px-8">
            <span className="text-wehrli text-base font-bold">{item.title}</span>
            <span className="bg-wehrli-50 text-wehrli group-data-open:bg-wehrli flex size-9 shrink-0 items-center justify-center rounded-full transition-colors group-data-open:text-white">
              <PlusIcon className="size-5 transition-transform group-data-open:rotate-45" aria-hidden="true" />
            </span>
          </DisclosureButton>
          <DisclosurePanel static className="hidden px-6 pb-6 text-sm data-open:block lg:px-8">
            {item.content}
          </DisclosurePanel>
        </Disclosure>
      ))}
    </div>
  </Section>
);
