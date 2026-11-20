import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MOCK_PRODUCTS } from '../shop.mocks';
import { ProductCard } from './product-card';

const meta: Meta<typeof ProductCard> = {
  title: 'Shop/ProductCard',
  component: ProductCard,
  args: MOCK_PRODUCTS[0],
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ProductCard>;

export const Catalog: Story = {};

export const Compact: Story = { args: { variant: 'compact' } };

export const LongName: Story = { args: MOCK_PRODUCTS[2] };

export const WithoutImage: Story = { args: MOCK_PRODUCTS[3] };

export const CompactWithoutImage: Story = { args: { ...MOCK_PRODUCTS[3], variant: 'compact' } };
