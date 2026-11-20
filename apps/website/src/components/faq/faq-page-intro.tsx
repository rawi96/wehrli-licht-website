import { Heading } from '@/components/nodes';
import { faqKontaktLinkClass, faqTopicPillClass } from '@/components/faq/faq-styles';
import type { FaqTopicGroup } from '@/utils/faq/group-by-topic';
import Link from 'next/link';
import { FC, ReactNode } from 'react';

type Props = {
  title: string;
  intro?: string | null;
  groups: FaqTopicGroup[];
  searchSlot: ReactNode;
};

const DefaultIntro = () => (
  <>
    Antworten zu unseren Leistungen, zum Atelier in Goldach und zum Online-Shop. Nutzen Sie die Suche – oder besuchen Sie
    unsere{' '}
    <Link href="/kontakt" className={faqKontaktLinkClass}>
      Kontaktseite
    </Link>
    , wenn Ihre Frage nicht dabei ist.
  </>
);

export const FaqPageIntro: FC<Props> = ({ title, intro, groups, searchSlot }) => (
  <header className="mt-20 mb-12 lg:mt-24 lg:mb-16">
    <Heading level="1" id="faq-page-heading">
      {title}
    </Heading>
    <p className="mt-4 max-w-2xl text-sm md:max-w-prose lg:text-base">{intro ?? <DefaultIntro />}</p>

    <div className="mt-8">{searchSlot}</div>

    {groups.length > 1 && (
      <nav aria-label="Themen auf dieser Seite" className="mt-8">
        <p className="text-wehrli mb-3 text-sm font-bold">Themen</p>
        <ul className="flex flex-wrap gap-2">
          {groups.map((group) => (
            <li key={group.topic.id}>
              <a href={`#faq-topic-${group.topic.slug}`} className={faqTopicPillClass}>
                {group.topic.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    )}
  </header>
);
