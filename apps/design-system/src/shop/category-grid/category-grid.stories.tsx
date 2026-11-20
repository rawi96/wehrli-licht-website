import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MOCK_CATEGORIES } from '../shop.mocks';
import { ShopCategoryGrid } from './category-grid';

const items = MOCK_CATEGORIES.map((category) => ({ ...category, linkLabel: 'Kategorie entdecken' }));

const meta: Meta<typeof ShopCategoryGrid> = {
  title: 'Shop/CategoryGrid',
  component: ShopCategoryGrid,
  args: { items },
  parameters: {
    docs: {
      description: {
        component: 'CMS block «Alle Kategorien»: every product category as a grid or a horizontal scroll row.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ShopCategoryGrid>;

export const Grid: Story = {};

export const TwoItems: Story = { args: { items: items.slice(0, 2) } };

export const Row: Story = {
  args: { layout: 'row', items: items.map((item, index) => ({ ...item, eyebrow: index % 2 ? undefined : 'Kategorie' })) },
};
