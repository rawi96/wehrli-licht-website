import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { NavigationAccordion } from './navigation-accordion';

const meta: Meta<typeof NavigationAccordion> = {
  title: 'Navigation/NavigationAccordion',
  component: NavigationAccordion,
  args: {
    label: 'Angebot',
    items: [
      { label: 'Lichtplanung', href: '#' },
      { label: 'Leuchtenbau', href: '#' },
      { label: 'Reparaturen', href: '#' },
    ],
  },
  decorators: [
    (Story) => (
      <dl className="bg-wehrli max-w-sm px-6 py-4">
        <Story />
      </dl>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof NavigationAccordion>;

export const Default: Story = {};

export const SingleLink: Story = { args: { items: [{ label: 'Lichtplanung', href: '#' }] } };
