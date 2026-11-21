'use client';

import { countFaqsInGroups, filterFaqGroups, type FaqTopicGroup } from '@/domain/content/faq';
import { formatFaqCount, formatFaqSearchStatus } from './format-faq-count';
import { FaqContactCta, FaqIntro, FaqLink, FaqNoResults, FaqSearch, FaqTopics } from '@wehrli/design-system';
import { FC, useMemo, useState } from 'react';

type Props = {
  title: string;
  intro?: string | null;
  groups: FaqTopicGroup[];
  /** Contact page (from the CMS). */
  contactHref: string;
};

const DefaultIntro: FC<{ contactHref: string }> = ({ contactHref }) => (
  <>
    Antworten zu unseren Leistungen, zum Atelier in Goldach und zum Online-Shop. Nutzen Sie die Suche – oder besuchen Sie
    unsere <FaqLink href={contactHref}>Kontaktseite</FaqLink>, wenn Ihre Frage nicht dabei ist.
  </>
);

export const FaqPageContent: FC<Props> = ({ title, intro, groups, contactHref }) => {
  const [query, setQuery] = useState('');
  const totalCount = useMemo(() => countFaqsInGroups(groups), [groups]);

  const filteredGroups = useMemo(() => filterFaqGroups(groups, query), [groups, query]);
  const resultCount = useMemo(() => countFaqsInGroups(filteredGroups), [filteredGroups]);

  const hasQuery = query.trim().length > 0;
  const topicNavGroups = hasQuery ? filteredGroups : groups;

  return (
    <>
      <FaqIntro
        title={title}
        intro={intro ?? <DefaultIntro contactHref={contactHref} />}
        topics={topicNavGroups.map(({ topic }) => ({
          id: topic.id,
          label: topic.title,
          slug: topic.slug,
        }))}
        search={
          <FaqSearch
            id="faq-search"
            value={query}
            onChange={setQuery}
            status={formatFaqSearchStatus(resultCount, totalCount, hasQuery)}
          />
        }
      />

      {hasQuery && filteredGroups.length === 0 ? (
        <FaqNoResults>
          Versuchen Sie ein anderes Stichwort oder <FaqLink href={contactHref}>kontaktieren Sie uns</FaqLink>.
        </FaqNoResults>
      ) : (
        <FaqTopics
          expanded={hasQuery}
          topics={filteredGroups.map(({ topic, faqs }) => ({
            id: topic.id,
            slug: topic.slug,
            title: topic.title,
            countLabel: formatFaqCount(faqs.length),
            questions: faqs.map(({ id, slug, question, answer }) => ({ id, slug, question, answer })),
          }))}
        />
      )}

      <FaqContactCta action={{ label: 'Zum Kontakt', href: contactHref }}>
        Ihre Frage ist nicht dabei? Rufen Sie uns an, schreiben Sie uns oder buchen Sie einen Termin im Showroom in Goldach.
      </FaqContactCta>
    </>
  );
};
