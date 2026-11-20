import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { mockLogo } from '../blocks.mocks';
import { inContainer } from '../block-decorator';
import { LogoGridBlock } from './logo-grid-block';

const logos = Array.from({ length: 8 }, (_, index) => ({
  id: String(index),
  ...mockLogo(`Partner ${index + 1}`),
  alt: `Partner ${index + 1}`,
  href: 'https://example.com',
}));

const meta: Meta<typeof LogoGridBlock> = {
  title: 'Blocks/LogoGrid',
  component: LogoGridBlock,
  args: { logos },
  parameters: { layout: 'fullscreen' },
  decorators: [inContainer],
};

export default meta;
type Story = StoryObj<typeof LogoGridBlock>;

export const Default: Story = {};

export const FewLogos: Story = { args: { logos: logos.slice(0, 2) } };
