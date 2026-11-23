import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FooterNavigation } from './footer-navigation';

const meta: Meta<typeof FooterNavigation> = {
  title: 'Navigation/FooterNavigation',
  component: FooterNavigation,
  args: {
    sections: [
      {
        title: 'Leistungen',
        links: [
          { label: 'Lichtplanung', href: '#planung' },
          { label: 'Leuchtenbau', href: '#bau' },
        ],
      },
      {
        title: 'Shop',
        links: [
          { label: 'Pendelleuchten', href: '#pendel' },
          { label: 'Stehleuchten', href: '#steh' },
          { label: 'Tischleuchten', href: '#tisch' },
        ],
      },
      { title: 'Über uns', links: [{ label: 'Atelier', href: '#atelier' }] },
    ],
  },
  decorators: [
    (Story) => (
      <div className="bg-wehrli p-6 text-white/80">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FooterNavigation>;

export const Default: Story = {};

export const OneSection: Story = { args: { sections: [{ title: 'Beratung', links: [{ label: 'FAQ', href: '#faq' }] }] } };
