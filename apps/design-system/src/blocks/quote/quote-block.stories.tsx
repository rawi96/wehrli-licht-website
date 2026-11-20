import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MOCK_AVATAR } from '../blocks.mocks';
import { inContainer } from '../block-decorator';
import { QuoteBlock } from './quote-block';

const testimonial = {
  quote: 'Die Beratung war kompetent und das neue Licht verändert den ganzen Raum.',
  image: MOCK_AVATAR,
  authorName: 'Alex Muster',
  authorDescription: 'Geschäftsführer',
  companyName: 'Muster AG',
  companyUrl: 'https://example.com',
};

const meta: Meta<typeof QuoteBlock> = {
  title: 'Blocks/Quote',
  component: QuoteBlock,
  args: { testimonials: [testimonial] },
  parameters: { layout: 'fullscreen' },
  decorators: [inContainer],
};

export default meta;
type Story = StoryObj<typeof QuoteBlock>;

export const OneQuote: Story = {};

export const SeveralQuotes: Story = {
  args: {
    testimonials: [
      testimonial,
      { ...testimonial, authorName: 'Kim Beispiel', image: undefined, companyUrl: undefined },
      { ...testimonial, quote: 'Kurz und gut.' },
    ],
  },
};
