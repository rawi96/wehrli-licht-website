import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MobileMenu } from './mobile-menu';

const meta: Meta<typeof MobileMenu> = {
  title: 'Navigation/MobileMenu',
  component: MobileMenu,
  args: {
    items: [
      {
        label: 'Lampenschirme',
        active: true,
        overview: { label: 'Zur Übersicht', href: '#lampenschirme' },
        feature: { description: 'Nach Mass, neu bezogen oder repariert. Handgefertigt in Goldach.' },
        columns: [
          {
            title: 'Leistungen',
            links: [
              { label: 'Nach Mass', href: '#nach-mass' },
              { label: 'Neu beziehen', href: '#neu-beziehen' },
            ],
            overview: { label: 'Alle Leistungen', href: '#leistungen' },
          },
          { title: 'Formen', links: [{ label: 'Zylinder', href: '#zylinder' }] },
        ],
      },
      {
        label: 'Über uns',
        children: [
          { label: 'Team', href: '#team' },
          { label: 'Magazin', href: '#magazin' },
        ],
      },
      { label: 'Projekte', href: '#projekte' },
    ],
    footer: (
      <a href="#kontakt" className="text-wehrli block rounded-md bg-white px-5 py-3 text-center text-base font-bold">
        Kontakt
      </a>
    ),
  },
  decorators: [
    (Story) => (
      <div className="surface-dark bg-wehrli max-w-sm p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MobileMenu>;

export const Default: Story = {};
