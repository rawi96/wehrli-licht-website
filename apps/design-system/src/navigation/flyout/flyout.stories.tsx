import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Flyout } from './flyout';

const meta: Meta<typeof Flyout> = {
  title: 'Navigation/Flyout',
  component: Flyout,
  args: {
    label: 'Leistungen',
    items: [
      { label: 'Lichtplanung', href: '#' },
      { label: 'Leuchtenbau', href: '#' },
      { label: 'Reparaturen', href: '#' },
    ],
  },
  decorators: [
    (Story) => (
      <div className="bg-wehrli relative flex h-72 justify-center p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Flyout>;

export const Default: Story = {};

export const Active: Story = { args: { active: true } };

export const LongLabels: Story = {
  args: {
    items: [
      { label: 'Beratung für Wohnräume und Gewerbeflächen', href: '#' },
      { label: 'Reparatur von Leuchten', href: '#' },
    ],
  },
};
