import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { inContainer } from '../block-decorator';
import { FaqBlock } from './faq-block';

const meta: Meta<typeof FaqBlock> = {
  title: 'Blocks/Faq',
  component: FaqBlock,
  args: {
    title: 'Häufige Fragen',
    intro: 'Die wichtigsten Antworten zur Lichtplanung.',
    allFaqsLink: { label: 'Alle Fragen ansehen', href: '#faq' },
    items: [
      { id: '1', question: 'Wie lange dauert eine Lichtplanung?', answer: 'Das hängt vom Umfang ab.' },
      {
        id: '2',
        question: 'Kann ich Leuchten zuerst zu Hause ausprobieren?',
        answer: 'Ja, viele Leuchten können Sie ausleihen.\nFragen Sie uns an.',
      },
      { id: '3', question: 'Arbeiten Sie mit Elektrikern zusammen?', answer: 'Ja, mit Partnern aus der Region.' },
    ],
  },
  parameters: { layout: 'fullscreen' },
  decorators: [inContainer],
};

export default meta;
type Story = StoryObj<typeof FaqBlock>;

export const Default: Story = {};

export const WithoutIntroAndLink: Story = { args: { intro: null, allFaqsLink: null, title: null } };

export const LongQuestion: Story = {
  args: {
    items: [
      {
        id: '1',
        question: 'Was kostet eine Lichtplanung für ein Einfamilienhaus mit mehreren Stockwerken und Aussenbereich?',
        answer: 'Das hängt vom Umfang ab. Gerne machen wir Ihnen eine Offerte.',
      },
    ],
  },
};
