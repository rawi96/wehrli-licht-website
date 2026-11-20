import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { inContainer } from '../block-decorator';
import { mockRichText } from '../rich-text.mocks';
import { TextBlock } from './text-block';

const meta: Meta<typeof TextBlock> = {
  title: 'Blocks/Text',
  component: TextBlock,
  args: { content: mockRichText('Lichtplanung', 2) },
  parameters: { layout: 'fullscreen' },
  decorators: [inContainer],
};

export default meta;
type Story = StoryObj<typeof TextBlock>;

export const Default: Story = {};

export const ShortText: Story = { args: { content: mockRichText() } };

export const WithoutMargins: Story = { args: { marginTop: false, marginBottom: false } };
