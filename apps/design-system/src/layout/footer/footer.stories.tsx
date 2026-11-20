import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Footer, FooterLinkButton } from './footer';

const meta: Meta<typeof Footer> = {
  title: 'Layout/Footer',
  component: Footer,
  parameters: { layout: 'fullscreen' },
  args: {
    contact: {
      companyName: 'Muster Licht GmbH',
      street: 'Musterstrasse 1',
      zip: '9000',
      place: 'St. Gallen',
      phone: '071 000 00 00',
      email: 'hallo@example.com',
      mapsHref: '#karte',
      openingHours: {
        title: 'Öffnungszeiten',
        text: (
          <p>
            Di–Fr 9–12 und 14–18 Uhr
            <br />
            Sa 9–14 Uhr
          </p>
        ),
      },
    },
    navigation: [
      {
        title: 'Angebot',
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
        ],
      },
      { title: 'Service', links: [{ label: 'FAQ', href: '#faq' }] },
    ],
    copyrightHolder: 'Muster Licht GmbH',
    year: 2026,
    privacyHref: '#datenschutz',
    socialLinks: [
      { network: 'linkedin', href: '#linkedin' },
      { network: 'instagram', href: '#instagram' },
      { network: 'facebook', href: '#facebook' },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {};

export const WithCookieSettings: Story = {
  args: { legalExtra: <FooterLinkButton onClick={() => undefined}>Cookie-Einstellungen</FooterLinkButton> },
};

export const Minimal: Story = {
  args: {
    contact: { email: 'hallo@example.com' },
    navigation: [],
    privacyHref: null,
    socialLinks: [],
  },
};
