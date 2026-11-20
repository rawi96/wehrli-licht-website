import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MOCK_IMAGES } from '../../blocks/blocks.mocks';
import { Lightbox } from './lightbox';

const slides = MOCK_IMAGES.map((image, index) => ({
  key: `bild-${index + 1}`,
  src: image.src,
  width: image.width,
  height: image.height ?? image.width,
}));

const meta: Meta<typeof Lightbox> = {
  title: 'Content/Lightbox',
  component: Lightbox,
  args: { slides },
  parameters: {
    docs: {
      description: {
        component:
          'Full-screen image viewer (yet-another-react-lightbox). It is open while the URL has `?image=<key>`; closing removes the parameter.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Lightbox>;

export const Open: Story = {
  parameters: { nextjs: { navigation: { query: { image: 'bild-2' } } } },
};

export const Closed: Story = {};
