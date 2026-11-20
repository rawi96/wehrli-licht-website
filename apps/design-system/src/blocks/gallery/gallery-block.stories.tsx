import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MOCK_IMAGES } from '../blocks.mocks';
import { inContainer } from '../block-decorator';
import { GalleryBlock } from './gallery-block';

const items = MOCK_IMAGES.map((image, index) => ({
  id: `bild-${index + 1}`,
  image,
  large: { src: image.src, width: image.width, height: image.height ?? image.width },
  eyebrow: 'Projekt',
  title: image.alt,
}));

const meta: Meta<typeof GalleryBlock> = {
  title: 'Blocks/Gallery',
  component: GalleryBlock,
  args: { items },
  parameters: { layout: 'fullscreen' },
  decorators: [inContainer],
};

export default meta;
type Story = StoryObj<typeof GalleryBlock>;

export const Default: Story = {};

export const WithTitles: Story = { args: { showTitles: true } };

export const OneImage: Story = { args: { items: items.slice(0, 1) } };
