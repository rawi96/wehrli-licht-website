import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { inContainer } from '../../blocks/block-decorator';
import { ProjectFacts } from './project-facts';

const meta: Meta<typeof ProjectFacts> = {
  title: 'Content/ProjectFacts',
  component: ProjectFacts,
  args: {
    facts: [
      { label: 'Kunde', value: 'Muster AG' },
      { label: 'Ort', value: 'Goldach' },
      { label: 'Bereich', value: 'Gastronomie' },
    ],
    services: [
      { label: 'Lichtplanung', href: '#planung' },
      { label: 'Sonderanfertigungen', href: '#sonder' },
    ],
  },
  parameters: { layout: 'fullscreen' },
  decorators: [inContainer],
};

export default meta;
type Story = StoryObj<typeof ProjectFacts>;

export const Default: Story = {};

export const OnlyFacts: Story = { args: { services: [] } };
