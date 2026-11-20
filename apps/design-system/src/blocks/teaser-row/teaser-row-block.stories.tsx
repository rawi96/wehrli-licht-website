import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MOCK_IMAGES } from '../blocks.mocks';
import { inContainer } from '../block-decorator';
import { TeaserRowBlock } from './teaser-row-block';

const teasers = MOCK_IMAGES.map((image, index) => ({
  id: String(index),
  title: image.alt,
  eyebrow: 'Projekt',
  linkLabel: 'Anschauen',
  href: '#',
  image,
}));

const meta: Meta<typeof TeaserRowBlock> = {
  title: 'Blocks/TeaserRow',
  component: TeaserRowBlock,
  args: { teasers },
  parameters: { layout: 'fullscreen' },
  decorators: [inContainer],
};

export default meta;
type Story = StoryObj<typeof TeaserRowBlock>;

export const ManyTeasers: Story = {};

export const OneTeaser: Story = { args: { teasers: teasers.slice(0, 1) } };

export const WithoutImage: Story = {
  args: { teasers: teasers.slice(0, 2).map((teaser) => ({ ...teaser, image: undefined })) },
};
