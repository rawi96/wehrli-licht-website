import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { inContainer } from '../block-decorator';
import { CardsBlock } from './cards-block';

const meta: Meta<typeof CardsBlock> = {
  title: 'Blocks/Cards',
  component: CardsBlock,
  decorators: [inContainer],
  args: {
    title: 'Was wir anbieten',
    intro: 'Eine kurze Einleitung zu den Themen darunter.',
    items: [
      {
        id: '1',
        icon: 'licht',
        title: 'Erstes Thema',
        text: 'Ein, zwei Sätze zum Thema.',
        link: { label: 'Mehr erfahren', href: '#' },
      },
      {
        id: '2',
        icon: 'stoff',
        title: 'Zweites Thema',
        text: 'Ein, zwei Sätze zum Thema.',
        link: { label: 'Mehr erfahren', href: '#' },
      },
      {
        id: '3',
        icon: 'werkzeug',
        title: 'Drittes Thema',
        text: 'Ein, zwei Sätze zum Thema.',
        link: { label: 'Mehr erfahren', href: '#' },
      },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof CardsBlock>;

export const ThreeCards: Story = {};

export const FourWithoutLinks: Story = {
  args: {
    title: null,
    intro: null,
    items: ['qualitaet', 'zeit', 'ort', 'herz'].map((icon, index) => ({
      id: String(index),
      icon: icon as 'qualitaet',
      title: `Vorteil ${index + 1}`,
      text: 'Ein kurzer Satz.',
    })),
  },
};
