import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CategoryNav } from '../category-nav/category-nav';
import { ProductCard } from '../product-card/product-card';
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '../shop.mocks';
import { ShopBrowseLayout } from './browse-layout';

const meta: Meta<typeof ShopBrowseLayout> = {
  title: 'Shop/BrowseLayout',
  component: ShopBrowseLayout,
  parameters: {
    docs: { description: { component: 'The category sidebar is shown from lg (1024px); widen the canvas to see it.' } },
  },
  args: {
    sidebar: (
      <CategoryNav
        variant="sidebar"
        links={MOCK_CATEGORIES.map((category, index) => ({ ...category, label: category.name, active: index === 0 }))}
      />
    ),
    children: (
      <div className="grid grid-cols-2 gap-6">
        {MOCK_PRODUCTS.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    ),
  },
};

export default meta;
type Story = StoryObj<typeof ShopBrowseLayout>;

export const Default: Story = {};
