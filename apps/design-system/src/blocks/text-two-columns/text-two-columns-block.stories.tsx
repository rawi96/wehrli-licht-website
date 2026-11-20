import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { inContainer } from '../block-decorator';
import { mockRichText } from '../rich-text.mocks';
import { TextTwoColumnsBlock } from './text-two-columns-block';

const meta: Meta<typeof TextTwoColumnsBlock> = {
  title: 'Blocks/TextTwoColumns',
  component: TextTwoColumnsBlock,
  args: { left: mockRichText('Beratung'), right: mockRichText('Montage', 2) },
  parameters: { layout: 'fullscreen' },
  decorators: [inContainer],
};

export default meta;
type Story = StoryObj<typeof TextTwoColumnsBlock>;

export const Default: Story = {};

export const OneColumnEmpty: Story = { args: { right: undefined } };
