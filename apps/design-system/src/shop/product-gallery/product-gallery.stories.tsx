import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MOCK_PRODUCT_IMAGES } from '../shop.mocks';
import { ProductGallery } from './product-gallery';

const meta: Meta<typeof ProductGallery> = {
  title: 'Shop/ProductGallery',
  component: ProductGallery,
  args: {
    label: 'Pendelleuchte',
    images: MOCK_PRODUCT_IMAGES.map((image, index) => ({ id: String(index), image })),
  },
  decorators: [
    (Story) => (
      <div className="max-w-xl">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ProductGallery>;

export const Default: Story = {};

export const OneImage: Story = { args: { images: [{ id: '0', image: MOCK_PRODUCT_IMAGES[0] }] } };
