import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { inContainer } from '../block-decorator';
import { MOCK_AVATAR } from '../blocks.mocks';
import { CalendlyBlock } from './calendly-block';

const meta: Meta<typeof CalendlyBlock> = {
  title: 'Blocks/Calendly',
  component: CalendlyBlock,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Inline Calendly booking widget (700px high). The Calendly script loads when the widget nears the viewport, so the story shows only the empty frame without a real booking link.',
      },
    },
  },
  decorators: [inContainer],
};

export default meta;
type Story = StoryObj<typeof CalendlyBlock>;

/** Without a booking link the block renders nothing. */
export const WithoutUrl: Story = { args: { url: undefined } };

/** Title and intro beside the calendar (the example link shows Calendly's own demo page). */
export const WithText: Story = {
  args: {
    url: 'https://calendly.com/example',
    title: 'Termin buchen',
    intro: 'Bringen Sie wenn möglich Fotos oder Masse mit.',
    points: ['Rund 60 Minuten', 'Im Showroom', 'Fotos und Masse mitbringen'],
    person: { name: 'Alex Muster', role: 'Beratung', image: MOCK_AVATAR },
  },
};
