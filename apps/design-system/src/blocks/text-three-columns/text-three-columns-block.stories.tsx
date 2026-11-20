import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { inContainer } from '../block-decorator';
import { mockRichText } from '../rich-text.mocks';
import { TextThreeColumnsBlock } from './text-three-columns-block';

const meta: Meta<typeof TextThreeColumnsBlock> = {
  title: 'Blocks/TextThreeColumns',
  component: TextThreeColumnsBlock,
  args: { left: mockRichText('Beratung'), middle: mockRichText('Planung', 2), right: mockRichText('Montage') },
  parameters: { layout: 'fullscreen' },
  decorators: [inContainer],
};

export default meta;
type Story = StoryObj<typeof TextThreeColumnsBlock>;

export const Default: Story = {};

export const OneColumnEmpty: Story = { args: { middle: undefined } };
