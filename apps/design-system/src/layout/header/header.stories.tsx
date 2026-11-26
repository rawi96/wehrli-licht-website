import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Header } from './header';

const meta: Meta<typeof Header> = {
  title: 'Layout/Header',
  component: Header,
  parameters: { layout: 'fullscreen' },
  args: {
    navigation: [
      {
        label: 'Leistungen',
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
      <div className="from-wehrli to-wehrli-dark bg-linear-to-br pb-48">
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

const megaMenuColumns = [
  {
    title: 'Beratung',
    links: [
      { label: 'Lampenschirm nach Mass', href: '#nach-mass' },
      { label: 'Neu beziehen', href: '#neu-beziehen' },
    ],
  },
  {
    title: 'Gestalten',
    links: [
      { label: 'Formen', href: '#formen' },
      { label: 'Materialien', href: '#materialien' },
    ],
  },
];

export const WithMegaMenuAndShop: Story = {
  args: {
    navigation: [
      { label: 'Lampenschirme', overview: { label: 'Übersicht Lampenschirme', href: '#' }, columns: megaMenuColumns },
      { label: 'Projekte', href: '#projekte' },
    ],
    shop: { label: 'Shop', overview: { label: 'Zum Shop', href: '#shop' }, columns: megaMenuColumns },
    contact: { label: 'Termin', href: '#termin' },
  },
  decorators: [
    (Story) => (
      <div className="pb-96">
        <Story />
      </div>
    ),
  ],
};
