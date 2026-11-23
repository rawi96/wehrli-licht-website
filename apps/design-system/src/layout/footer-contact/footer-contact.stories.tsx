import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FooterContact } from './footer-contact';

const meta: Meta<typeof FooterContact> = {
  title: 'Layout/FooterContact',
  component: FooterContact,
  args: {
    companyName: 'Muster Licht GmbH',
    street: 'Musterstrasse 1',
    zip: '9000',
    place: 'St. Gallen',
    phone: '071 000 00 00',
    email: 'hallo@example.com',
    mapsHref: '#karte',
    openingHours: { title: 'Öffnungszeiten', text: <p>Di–Fr 9–12 und 14–18 Uhr</p> },
  },
  decorators: [
    (Story) => (
      <div className="bg-wehrli max-w-sm p-6 text-white/80">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FooterContact>;

export const Default: Story = {};

export const WithHoliday: Story = {
  args: {
    holiday: {
      title: 'Betriebsferien',
      text: (
        <>
          <p>Vom 24. Dezember bis 5. Januar ist das Atelier geschlossen.</p>
          <p>Bestellungen im Shop werden danach versendet.</p>
        </>
      ),
    },
  },
};

export const WithoutMapLink: Story = { args: { mapsHref: null } };

export const OnlyEmail: Story = {
  args: { companyName: null, street: null, zip: null, place: null, phone: null, mapsHref: null, openingHours: null },
};
