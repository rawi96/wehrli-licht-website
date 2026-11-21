import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MegaMenu } from './mega-menu';

const meta: Meta<typeof MegaMenu> = {
  title: 'Navigation/MegaMenu',
  component: MegaMenu,
  args: {
    label: 'Lampenschirme',
    overview: { label: 'Übersicht Lampenschirme', href: '#' },
    columns: [
      {
        title: 'Service',
        href: '#service',
        links: [
          { label: 'Lampenschirm nach Mass', href: '#nach-mass' },
          { label: 'Neu beziehen & reparieren', href: '#neu-beziehen' },
          { label: 'Für Gewerbe', href: '#gewerbe' },
        ],
      },
      {
        title: 'Nach Leuchte',
        links: [
          { label: 'Schirme für Stehlampen', href: '#stehlampe' },
          { label: 'Schirme für Tischlampen', href: '#tischlampe' },
        ],
      },
      {
        title: 'Gestalten',
        links: [
          { label: 'Formen', href: '#formen' },
          { label: 'Materialien', href: '#materialien' },
        ],
      },
    ],
    footerLinks: [{ label: 'Fertige Lampenschirme im Shop', href: '#shop' }],
  },
  decorators: [
    (Story) => (
      <div className="bg-wehrli relative flex h-120 justify-center p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MegaMenu>;

export const Default: Story = {};

export const Active: Story = { args: { active: true } };

export const AsButton: Story = { args: { label: 'Shop', trigger: 'button', overview: { label: 'Zum Shop', href: '#' } } };

export const WithoutOverviewAndFooter: Story = { args: { overview: null, footerLinks: [] } };

export const ManyColumns: Story = {
  args: {
    columns: Array.from({ length: 5 }, (_, index) => ({
      title: `Spalte ${index + 1}`,
      links: Array.from({ length: 6 }, (__, linkIndex) => ({
        label: `Lichtplanung ${linkIndex + 1}`,
        href: `#${index}-${linkIndex}`,
      })),
    })),
  },
};
