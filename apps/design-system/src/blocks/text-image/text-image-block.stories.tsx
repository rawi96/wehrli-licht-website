import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PLACEHOLDER_LANDSCAPE } from '../../docs/placeholders';
import { inContainer } from '../block-decorator';
import { mockRichText } from '../rich-text.mocks';
import { TextImageBlock } from './text-image-block';

const meta: Meta<typeof TextImageBlock> = {
  title: 'Blocks/TextImage',
  component: TextImageBlock,
  args: { content: mockRichText('Licht nach Mass', 2), image: PLACEHOLDER_LANDSCAPE },
  parameters: { layout: 'fullscreen' },
  decorators: [inContainer],
};

export default meta;
type Story = StoryObj<typeof TextImageBlock>;

export const ImageLeft: Story = {};

export const ImageRight: Story = { args: { layout: 'image-right' } };

export const WithoutImage: Story = { args: { image: undefined } };

export const WithoutText: Story = { args: { content: undefined } };
