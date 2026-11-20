import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Breadcrumbs } from './breadcrumbs';

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Navigation/Breadcrumbs',
  component: Breadcrumbs,
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Angebot', href: '/angebot' },
      { label: 'Lichtplanung', href: '/angebot/lichtplanung' },
    ],
  },
  decorators: [
    (Story) => (
      <div className="pb-16">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

export const Default: Story = {};

export const StartPageOnly: Story = { args: { items: [{ label: 'Home', href: '/' }] } };

export const LongPath: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Shop', href: '/shop' },
      { label: 'Pendelleuchten', href: '/shop/pendelleuchten' },
      { label: 'Pendelleuchte mit einem sehr langen Namen aus Messing', href: '/shop/pendelleuchte' },
    ],
  },
};
