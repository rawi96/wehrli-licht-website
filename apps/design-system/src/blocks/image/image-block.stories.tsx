import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MOCK_IMAGES } from '../blocks.mocks';
import { inContainer } from '../block-decorator';
import { ImageBlock } from './image-block';

const images = MOCK_IMAGES.map((image, index) => ({ id: String(index), image, caption: image.alt }));

const meta: Meta<typeof ImageBlock> = {
  title: 'Blocks/Image',
  component: ImageBlock,
  args: { images: images.slice(0, 1) },
  parameters: { layout: 'fullscreen' },
  decorators: [inContainer],
};

export default meta;
type Story = StoryObj<typeof ImageBlock>;

export const SingleImage: Story = {};

export const TwoImages: Story = { args: { images: [images[0], images[4]] } };

export const ManyImages: Story = { args: { images: images.slice(0, 4) } };

export const WithoutCaption: Story = { args: { images: [{ ...images[0], caption: undefined }] } };
