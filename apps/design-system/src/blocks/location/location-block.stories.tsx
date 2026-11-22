import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LocationBlock } from './location-block';

const meta: Meta<typeof LocationBlock> = {
  title: 'Blocks/Location',
  component: LocationBlock,
  args: {
    title: 'Öffnungszeiten & Anfahrt',
    companyName: 'Muster Licht GmbH',
    street: 'Musterstrasse 1',
    zip: '9000',
    place: 'St. Gallen',
    phone: '+41 71 000 00 00',
    email: 'hallo@example.com',
    mapsHref: '#karte',
    openingHours: {
      title: 'Öffnungszeiten',
      text: (
        <ul>
          <li>Dienstag bis Freitag: 9–12 und 14–18 Uhr</li>
          <li>Samstag: 9–12 Uhr</li>
        </ul>
      ),
    },
  },
};

export default meta;
type Story = StoryObj<typeof LocationBlock>;

export const Default: Story = {};
export const WithHoliday: Story = {
  args: { holiday: { title: 'Betriebsferien', text: <p>Vom 22. Dezember bis 5. Januar geschlossen.</p> } },
};
