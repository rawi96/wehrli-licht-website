'use client';

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { FC, useEffect, useState } from 'react';

export type FaqAccordionItem = {
  id: string;
  question: string;
  /** Plain text; line breaks are kept. */
  answer: string;
  /** Anchor of the question, e.g. for links from other pages. */
  anchor?: string;
};

type Props = {
  items: FaqAccordionItem[];
  /** All answers open, e.g. while searching. */
  expanded?: boolean;
};

/** The anchor in the URL (/faq#lieferzeit), so a linked question opens. */
const useHashAnchor = (): string => {
  const [anchor, setAnchor] = useState('');

  useEffect(() => {
    const update = () => setAnchor(decodeURIComponent(window.location.hash.slice(1)));
    // eslint-disable-next-line @eslint-react/set-state-in-effect -- the URL hash is only readable in the browser
    update();
    window.addEventListener('hashchange', update);

    return () => window.removeEventListener('hashchange', update);
  }, []);

  return anchor;
};

/**
 * Questions as an accordion in a white box. Answers stay in the document when closed, so search engines see them.
 * A question linked with its anchor (#…) opens.
 */
export const FaqAccordion: FC<Props> = ({ items, expanded = false }) => {
  const anchor = useHashAnchor();

  return (
    <ul className="divide-y divide-gray-200 overflow-hidden rounded-md bg-white shadow-sm">
      {items.map((item) => {
        const open = expanded || (!!item.anchor && item.anchor === anchor);

        return (
          <li key={item.id} id={item.anchor} className="scroll-mt-32">
            {/* The key resets the open state when `expanded` or the linked question change. */}
            <Disclosure key={open ? 'open' : 'closed'} defaultOpen={open}>
              {/* The outline stays inside: the rounded box clips everything outside. */}
              <DisclosureButton className="group flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-gray-50 focus-visible:-outline-offset-4 sm:px-6">
                <span className="text-sm font-bold text-black">{item.question}</span>
                <span className="bg-wehrli-50 text-wehrli group-data-open:bg-wehrli flex size-7 shrink-0 items-center justify-center rounded-full transition-colors group-data-open:text-white">
                  <PlusIcon
                    className="size-4 transition-transform duration-200 group-data-open:rotate-45 motion-reduce:transition-none"
                    aria-hidden="true"
                  />
                </span>
              </DisclosureButton>
              <DisclosurePanel unmount={false} className="px-5 pb-5 text-sm whitespace-pre-line text-gray-600 sm:px-6">
                {item.answer}
              </DisclosurePanel>
            </Disclosure>
          </li>
        );
      })}
    </ul>
  );
};
