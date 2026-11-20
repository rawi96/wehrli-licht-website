import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Header } from './header';

const meta: Meta<typeof Header> = {
  title: 'Layout/Header',
  component: Header,
  parameters: { layout: 'fullscreen' },
  args: {
    navigation: [
      {
        label: 'Angebot',
        active: true,
        children: [
          { label: 'Lichtplanung', href: '#planung' },
          { label: 'Leuchtenbau', href: '#bau' },
        ],
      },
      { label: 'Atelier', href: '#atelier' },
      { label: 'Projekte', href: '#projekte' },
      { label: 'Shop', href: '#shop' },
    ],
    contact: { label: 'Kontakt', href: '#kontakt' },
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Solid: Story = {};

export const Overlay: Story = {
  args: { variant: 'overlay' },
  decorators: [
    (Story) => (
      <div className="from-wehrli-300 to-wehrli-700 bg-linear-to-br pb-48">
        <Story />
      </div>
    ),
  ],
};

export const WithoutContact: Story = { args: { contact: null } };

export const WithMobileExtra: Story = {
  args: {
    renderMobileMenuExtra: () => (
      <div className="border-t border-white/20 pt-4">
        <p className="px-3 text-sm text-white">Zusätzliche Links</p>
      </div>
    ),
  },
  globals: { viewport: { value: 'mobile1' } },
};
