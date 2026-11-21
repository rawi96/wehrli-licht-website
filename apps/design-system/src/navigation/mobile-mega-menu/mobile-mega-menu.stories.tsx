import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MobileMegaMenu } from './mobile-mega-menu';

const meta: Meta<typeof MobileMegaMenu> = {
  title: 'Navigation/MobileMegaMenu',
  component: MobileMegaMenu,
  args: {
    label: 'Licht planen',
    overview: { label: 'Übersicht Licht planen', href: '#' },
    columns: [
      {
        title: 'Für Zuhause',
        links: [
          { label: 'Ich baue ein Haus', href: '#haus' },
          { label: 'Ich ziehe um', href: '#umzug' },
        ],
      },
      {
        title: 'Leistungen',
        links: [
          { label: 'Lichtberatung', href: '#beratung' },
          { label: 'Lichtplanung', href: '#planung' },
        ],
      },
    ],
  },
  decorators: [
    (Story) => (
      <div className="bg-wehrli max-w-sm p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MobileMegaMenu>;

export const Default: Story = {};

export const WithFooterLinks: Story = { args: { footerLinks: [{ label: 'Ratgeber', href: '#ratgeber' }] } };

export const WithoutOverview: Story = { args: { overview: null } };
