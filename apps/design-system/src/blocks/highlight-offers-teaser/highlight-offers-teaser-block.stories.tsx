import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MOCK_IMAGES } from '../blocks.mocks';
import { inContainerFullWidth } from '../block-decorator';
import { HighlightOffersTeaserBlock } from './highlight-offers-teaser-block';

const offers = MOCK_IMAGES.map((image, index) => ({
  id: String(index),
  eyebrow: 'Leistungen',
  title: ['Lichtplanung', 'Lichtberatung', 'Leuchten', 'Montage', 'Reparatur', 'Smart Home'][index],
  href: '#',
  image,
}));

const meta: Meta<typeof HighlightOffersTeaserBlock> = {
  title: 'Blocks/HighlightOffersTeaser',
  component: HighlightOffersTeaserBlock,
  args: {
    id: 'angebote',
    title: 'Unsere Leistungen',
    subline: 'Von der Beratung bis zur Montage: alles rund ums Licht.',
    cta: { label: 'Alle Leistungen', href: '#' },
    offers,
  },
  parameters: { layout: 'fullscreen' },
  decorators: [inContainerFullWidth],
};

export default meta;
type Story = StoryObj<typeof HighlightOffersTeaserBlock>;

export const ManyOffers: Story = {};

export const TwoOffers: Story = { args: { offers: offers.slice(0, 2) } };

export const OneOffer: Story = { args: { offers: offers.slice(0, 1) } };

/** Home page today: two large cards and three small ones; on phones the third small card fills its row, from sm all three sit in one row. */
export const FiveOffers: Story = { args: { offers: offers.slice(0, 5) } };

export const ThreeOffers: Story = { args: { offers: offers.slice(0, 3) } };
