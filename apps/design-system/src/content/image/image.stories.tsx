import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PLACEHOLDER_LANDSCAPE, PLACEHOLDER_PORTRAIT } from '../../docs/placeholders';
import { Image } from './image';

const meta: Meta<typeof Image> = {
  title: 'Content/Image',
  component: Image,
  args: { image: PLACEHOLDER_LANDSCAPE, sizes: '600px' },
  decorators: [
    (Story) => (
      <div className="relative aspect-video w-full max-w-xl overflow-hidden">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Image>;

export const Cover: Story = {};

export const Rounded: Story = { args: { imgClassName: 'rounded-lg object-cover' } };

export const Contain: Story = { args: { image: PLACEHOLDER_PORTRAIT, imgClassName: 'object-contain', placeholder: false } };
