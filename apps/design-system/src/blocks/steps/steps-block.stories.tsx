import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { inContainer } from '../block-decorator';
import { StepsBlock } from './steps-block';

const meta: Meta<typeof StepsBlock> = {
  title: 'Blocks/Steps',
  component: StepsBlock,
  decorators: [inContainer],
  args: {
    title: 'So läuft es ab',
    intro: 'In vier Schritten zum Ergebnis.',
    items: [
      { id: '1', title: 'Anfragen', text: 'Ein kurzer Satz zum Schritt.' },
      { id: '2', title: 'Beraten', text: 'Ein kurzer Satz zum Schritt.' },
      { id: '3', title: 'Umsetzen', text: 'Ein kurzer Satz zum Schritt.' },
      { id: '4', title: 'Fertig', text: 'Ein kurzer Satz zum Schritt.' },
    ],
    link: { label: 'Jetzt anfragen', href: '#' },
  },
};

export default meta;
type Story = StoryObj<typeof StepsBlock>;

export const Process: Story = {};

export const Timeline: Story = {
  args: {
    title: 'Unsere Geschichte',
    intro: null,
    link: null,
    items: [1950, 1960, 1980, 2000, 2020].map((year) => ({
      id: String(year),
      marker: String(year),
      title: `Ereignis ${year}`,
      text: 'Was in diesem Jahr geschah.',
    })),
  },
};
