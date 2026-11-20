import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MOCK_CATEGORIES } from '../shop.mocks';
import { ShopCategoryCard } from './category-card';

const meta: Meta<typeof ShopCategoryCard> = {
  title: 'Shop/CategoryCard',
  component: ShopCategoryCard,
  args: MOCK_CATEGORIES[1],
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ShopCategoryCard>;

export const Default: Story = {};

export const WithoutImage: Story = { args: MOCK_CATEGORIES[3] };

export const WithoutDescription: Story = { args: MOCK_CATEGORIES[2] };
