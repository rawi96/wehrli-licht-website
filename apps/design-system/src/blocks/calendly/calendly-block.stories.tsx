import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { inContainer } from '../block-decorator';
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
