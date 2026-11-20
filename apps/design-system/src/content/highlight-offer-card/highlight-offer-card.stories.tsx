import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PLACEHOLDER_LANDSCAPE } from '../../docs/placeholders';
import { HighlightOfferCard } from './highlight-offer-card';

const meta: Meta<typeof HighlightOfferCard> = {
  title: 'Content/HighlightOfferCard',
  component: HighlightOfferCard,
  args: {
    variant: 'featured',
    eyebrow: 'Angebot',
    title: 'Lichtberatung vor Ort',
    href: '#',
    image: PLACEHOLDER_LANDSCAPE,
  },
  decorators: [
    (Story) => (
      <div className="max-w-xl">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof HighlightOfferCard>;

export const Featured: Story = {};

export const Compact: Story = {
  args: { variant: 'compact' },
  decorators: [
    (Story) => (
      <div className="max-w-60">
        <Story />
      </div>
    ),
  ],
};

export const LongTitle: Story = {
  args: { title: 'Planung, Lieferung und Montage von Leuchten für Wohnräume und Geschäftsräume' },
};
