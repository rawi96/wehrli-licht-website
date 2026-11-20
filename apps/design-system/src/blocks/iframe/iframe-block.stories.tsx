import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { inContainer } from '../block-decorator';
import { IframeBlock } from './iframe-block';

const meta: Meta<typeof IframeBlock> = {
  title: 'Blocks/Iframe',
  component: IframeBlock,
  args: { src: 'about:blank', title: 'Karte' },
  parameters: { layout: 'fullscreen' },
  decorators: [inContainer],
};

export default meta;
type Story = StoryObj<typeof IframeBlock>;

export const Default: Story = {};
