import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { inContainer } from '../block-decorator';
import { FactsBlock } from './facts-block';

const meta: Meta<typeof FactsBlock> = {
  title: 'Blocks/Facts',
  component: FactsBlock,
  decorators: [inContainer],
  args: {
    title: 'Auf einen Blick',
    items: [
      { id: '1', value: '1950', label: 'Gegründet' },
      { id: '2', value: '3', label: 'Generationen' },
      { id: '3', value: '20', label: 'Formen', text: 'Jede in jeder Grösse.' },
      { id: '4', value: '100 %', label: 'Handarbeit' },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof FactsBlock>;

export const Four: Story = {};

export const Three: Story = { args: { title: null, items: meta.args?.items?.slice(0, 3) } };
