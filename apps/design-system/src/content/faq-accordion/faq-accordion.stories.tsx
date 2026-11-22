import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FaqAccordion } from './faq-accordion';

const meta = {
  title: 'Content/FaqAccordion',
  component: FaqAccordion,
  parameters: {
    docs: {
      description: {
        component:
          'Questions and answers as an accordion, used by the FAQ block and the FAQ page. A question whose anchor is in the URL (#…) opens.',
      },
    },
  },
  args: {
    items: [
      {
        id: '1',
        anchor: 'lieferzeit',
        question: 'Wie lange dauert die Lieferung?',
        answer: 'Lagerartikel versenden wir innert zwei Arbeitstagen.',
      },
      {
        id: '2',
        anchor: 'abholung',
        question: 'Kann ich eine Bestellung abholen?',
        answer: 'Ja, nach Absprache im Atelier.\nBitte melden Sie sich vorher.',
      },
      {
        id: '3',
        question: 'Fertigen Sie Lampenschirme nach Mass?',
        answer: 'Ja, in jeder Form und Grösse, mit Ihrem Stoff oder aus unserer Auswahl.',
      },
    ],
  },
} satisfies Meta<typeof FaqAccordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** All answers open, as while searching. */
export const Expanded: Story = { args: { expanded: true } };

export const SingleQuestion: Story = {
  args: {
    items: [{ id: '1', question: 'Wie lange dauert die Lieferung?', answer: 'Innert zwei Arbeitstagen.' }],
  },
};

export const LongQuestion: Story = {
  args: {
    items: [
      {
        id: '1',
        question:
          'Kann ich einen alten Lampenschirm meiner Grossmutter neu beziehen lassen, auch wenn das Gestell schon etwas verbogen ist?',
        answer: 'Ja. Wir richten das Gestell und beziehen es neu.',
      },
    ],
  },
};
