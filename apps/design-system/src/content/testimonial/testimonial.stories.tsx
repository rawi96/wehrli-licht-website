import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MOCK_AVATAR } from '../../blocks/blocks.mocks';
import { Testimonial } from './testimonial';

const meta: Meta<typeof Testimonial> = {
  title: 'Content/Testimonial',
  component: Testimonial,
  args: {
    quote: 'Die Beratung war kompetent und das neue Licht verändert den ganzen Raum.',
    image: MOCK_AVATAR,
    authorName: 'Alex Muster',
    authorDescription: 'Geschäftsführer',
    companyName: 'Muster AG',
    companyUrl: 'https://example.com',
  },
};

export default meta;
type Story = StoryObj<typeof Testimonial>;

export const Large: Story = {};

export const Small: Story = {
  args: { size: 'small' },
  decorators: [
    (Story) => (
      <div className="max-w-xl">
        <Story />
      </div>
    ),
  ],
};

export const QuoteOnly: Story = {
  args: { image: undefined, authorName: undefined, authorDescription: undefined, companyName: undefined },
};

export const LongQuote: Story = {
  args: {
    quote:
      'Von der ersten Skizze bis zur Montage hat alles gestimmt. Die Leuchten fügen sich ruhig in die Architektur ein, das Licht ist angenehm und blendfrei, und wir können es für jede Situation anpassen.\nDas Team hat sich viel Zeit genommen.',
    companyUrl: undefined,
  },
};
