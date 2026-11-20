import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MOCK_IMAGES } from '../../blocks/blocks.mocks';
import { GalleryGrid, GalleryItem } from './gallery-grid';

const items: GalleryItem[] = MOCK_IMAGES.map((image, index) => ({
  id: `bild-${index + 1}`,
  image,
  large: { src: image.src, width: image.width, height: image.height ?? image.width },
  eyebrow: 'Projekt',
  title: image.alt,
}));

const meta: Meta<typeof GalleryGrid> = {
  title: 'Content/GalleryGrid',
  component: GalleryGrid,
  args: { items },
  parameters: {
    docs: {
      description: {
        component:
          'Images in rows of the same height, each in its own aspect ratio. A click sets `?image=<id>` and opens the Lightbox.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof GalleryGrid>;

export const Default: Story = {};

export const WithTitles: Story = { args: { showTitles: true } };

export const SingleImage: Story = { args: { items: items.slice(0, 1) } };
