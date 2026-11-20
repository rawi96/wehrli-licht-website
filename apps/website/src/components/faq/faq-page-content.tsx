'use client';

import type { FaqTopicGroup } from '@/utils/faq/group-by-topic';
import { countFaqsInGroups, filterFaqGroups } from '@/utils/faq/filter-faq-groups';
import { formatFaqCount, formatFaqSearchStatus } from '@/utils/faq/format-faq-count';
import { FaqContactCta, FaqIntro, FaqLink, FaqNoResults, FaqSearch, FaqTopics } from '@wehrli/design-system';
import { FC, useMemo, useState } from 'react';

type Props = {
  title: string;
  intro?: string | null;
  groups: FaqTopicGroup[];
};

const CONTACT_HREF = '/kontakt';

const DefaultIntro = () => (
  <>
    Antworten zu unseren Leistungen, zum Atelier in Goldach und zum Online-Shop. Nutzen Sie die Suche – oder besuchen Sie
    unsere <FaqLink href={CONTACT_HREF}>Kontaktseite</FaqLink>, wenn Ihre Frage nicht dabei ist.
  </>
);

export const FaqPageContent: FC<Props> = ({ title, intro, groups }) => {
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
        intro={intro ?? <DefaultIntro />}
        topics={topicNavGroups.map(({ topic }) => ({
          id: topic.id,
          label: topic.title,
          href: `#faq-topic-${topic.slug}`,
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
          Versuchen Sie ein anderes Stichwort oder <FaqLink href={CONTACT_HREF}>kontaktieren Sie uns</FaqLink>.
        </FaqNoResults>
      ) : (
        <FaqTopics
          topics={filteredGroups.map(({ topic, faqs }) => ({
            id: topic.id,
            slug: topic.slug,
            title: topic.title,
            countLabel: formatFaqCount(faqs.length),
            questions: faqs.map(({ id, slug, question, answer }) => ({ id, slug, question, answer })),
          }))}
        />
      )}

      <FaqContactCta>
        Ihre Frage ist nicht dabei? Auf unserer <FaqLink href={CONTACT_HREF}>Kontaktseite</FaqLink> finden Sie alle Wege, uns
        zu erreichen – per Telefon, E-Mail oder Termin im Atelier Goldach.
      </FaqContactCta>
    </>
  );
};
