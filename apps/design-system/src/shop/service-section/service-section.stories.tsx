import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ShopServiceItem, ShopServiceSection } from './service-section';

const ITEMS: ShopServiceItem[] = [
  { id: '1', icon: 'shipping', title: 'Versand', description: 'Lieferung in die ganze Schweiz.' },
  {
    id: '2',
    icon: 'pickup',
    title: 'Abholung',
    description: 'Gratis während den Öffnungszeiten.',
    link: { href: '#', label: 'Öffnungszeiten' },
  },
  { id: '3', icon: 'payment', title: 'Bezahlung', description: 'Vorauskasse, vor Ort oder online.' },
  { id: '4', icon: 'viewing', title: 'Besichtigung', description: 'Leuchten vor Ort anschauen.' },
  {
    id: '5',
    icon: 'showroom',
    title: 'Ausstellung mit einem langen Titel',
    description: 'Eine längere Beschreibung, die über mehrere Zeilen läuft und zeigt, wie die Karten gleich hoch bleiben.',
  },
  { id: '6', icon: 'unbekannt', title: 'Unbekanntes Icon', description: 'Zeigt das Standard-Icon.' },
];

const meta: Meta<typeof ShopServiceSection> = {
  title: 'Shop/ServiceSection',
  component: ShopServiceSection,
  parameters: { layout: 'fullscreen' },
  args: {
    headingId: 'service-heading',
    title: 'Unser Service',
    intro: <p>Persönlich beraten, sorgfältig geliefert.</p>,
    actionLink: { href: '#', label: 'Alle Angebote' },
    items: ITEMS,
  },
};

export default meta;
type Story = StoryObj<typeof ShopServiceSection>;

export const Default: Story = {};

export const OneItem: Story = { args: { items: ITEMS.slice(0, 1), actionLink: null } };
