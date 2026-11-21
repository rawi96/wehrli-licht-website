import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { FaqContactCta, FaqIntro, FaqLink, FaqNoResults, FaqSearch, FaqTopic, FaqTopics } from './faq';

const meta: Meta = {
  title: 'Content/Faq',
  parameters: {
    docs: {
      description: {
        component:
          'Parts of the FAQ page: intro with search and topic links, topic cards with questions, empty search result and contact card. Grouping, filtering and counting stay in the website.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const TOPICS: FaqTopic[] = [
  {
    id: '1',
    slug: 'lieferung',
    title: 'Lieferung',
    countLabel: '2 Fragen',
    questions: [
      {
        id: 'q1',
        slug: 'lieferzeit',
        question: 'Wie lange dauert die Lieferung?',
        answer: 'Lagerartikel versenden wir innert zwei Arbeitstagen.',
      },
      {
        id: 'q2',
        slug: 'abholung',
        question: 'Kann ich eine Bestellung abholen?',
        answer: 'Ja, nach Absprache im Atelier.\nBitte melden Sie sich vorher.',
      },
    ],
  },
  {
    id: '2',
    slug: 'lichtplanung',
    title: 'Lichtplanung',
    countLabel: '1 Frage',
    questions: [
      {
        id: 'q3',
        slug: 'kosten',
        question: 'Was kostet eine Lichtplanung für eine Wohnung mit mehreren Räumen und unterschiedlichen Anforderungen?',
        answer: 'Das hängt vom Umfang ab. Gerne machen wir Ihnen eine Offerte.',
      },
    ],
  },
];

const Search = () => {
  const [value, setValue] = useState('');

  return <FaqSearch id="faq-search" value={value} onChange={setValue} status="3 Fragen" />;
};

export const Page: Story = {
  render: () => (
    <div className="bg-white-200 p-4">
      <FaqIntro
        title="Häufig gestellte Fragen"
        intro={
          <>
            Antworten zu Beratung und Shop. Ihre Frage fehlt? Besuchen Sie unsere <FaqLink href="#">Kontaktseite</FaqLink>.
          </>
        }
        search={<Search />}
        topics={TOPICS.map((topic) => ({ id: topic.id, label: topic.title, slug: topic.slug }))}
      />
      <FaqTopics topics={TOPICS} />
      <FaqContactCta action={{ label: 'Zum Kontakt', href: '#' }}>
        Rufen Sie uns an, schreiben Sie uns oder buchen Sie einen Termin.
      </FaqContactCta>
    </div>
  ),
};

export const SearchField: Story = { render: () => <Search /> };

export const NoResults: Story = {
  render: () => (
    <div className="bg-white-200 p-4">
      <FaqNoResults>
        Versuchen Sie ein anderes Stichwort oder <FaqLink href="#">kontaktieren Sie uns</FaqLink>.
      </FaqNoResults>
    </div>
  ),
};

export const OneTopic: Story = {
  render: () => (
    <div className="bg-white-200 p-4">
      <FaqTopics topics={TOPICS.slice(1)} />
    </div>
  ),
};
