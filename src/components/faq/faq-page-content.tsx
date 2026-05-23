'use client';

import { FaqContactCta } from '@/components/faq/faq-contact-cta';
import { FaqPageIntro } from '@/components/faq/faq-page-intro';
import { FaqSearch } from '@/components/faq/faq-search';
import { faqCardClass, faqKontaktLinkClass } from '@/components/faq/faq-styles';
import { FaqTopicSections } from '@/components/faq/faq-topic-sections';
import type { FaqTopicGroup } from '@/utils/faq/group-by-topic';
import { countFaqsInGroups, filterFaqGroups } from '@/utils/faq/filter-faq-groups';
import Link from 'next/link';
import { FC, useMemo, useState } from 'react';

type Props = {
  title: string;
  intro?: string | null;
  groups: FaqTopicGroup[];
};

export const FaqPageContent: FC<Props> = ({ title, intro, groups }) => {
  const [query, setQuery] = useState('');
  const totalCount = useMemo(() => countFaqsInGroups(groups), [groups]);

  const filteredGroups = useMemo(() => filterFaqGroups(groups, query), [groups, query]);
  const resultCount = useMemo(() => countFaqsInGroups(filteredGroups), [filteredGroups]);

  const topicNavGroups = query.trim() ? filteredGroups : groups;
  const hasQuery = query.trim().length > 0;

  return (
    <>
      <FaqPageIntro
        title={title}
        intro={intro}
        groups={topicNavGroups}
        searchSlot={
          <FaqSearch id="faq-search" value={query} onChange={setQuery} resultCount={resultCount} totalCount={totalCount} />
        }
      />

      {hasQuery && filteredGroups.length === 0 ? (
        <div className={`${faqCardClass} text-center`} role="status" aria-live="polite">
          <p className="text-wehrli text-base font-bold">Keine passenden Fragen gefunden</p>
          <p className="mt-2 text-sm text-gray-600">
            Versuchen Sie ein anderes Stichwort oder{' '}
            <Link href="/kontakt" className={faqKontaktLinkClass}>
              kontaktieren Sie uns
            </Link>
            .
          </p>
        </div>
      ) : (
        <FaqTopicSections groups={filteredGroups} />
      )}

      <FaqContactCta />
    </>
  );
};
