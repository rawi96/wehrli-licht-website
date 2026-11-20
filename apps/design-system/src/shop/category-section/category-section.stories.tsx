import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MOCK_CATEGORIES } from '../shop.mocks';
import { ShopCategorySection } from './category-section';

const meta: Meta<typeof ShopCategorySection> = {
  title: 'Shop/CategorySection',
  component: ShopCategorySection,
  parameters: { layout: 'fullscreen' },
  args: {
    sectionId: 'kategorien',
    headingId: 'kategorien-heading',
    title: 'Kategorien',
    body: 'Finden Sie die passende Leuchte für jeden Raum.',
    actionLink: { href: '#', label: 'Alle Leuchten' },
    categories: MOCK_CATEGORIES,
  },
};

export default meta;
type Story = StoryObj<typeof ShopCategorySection>;

export const Default: Story = {};

export const FewCategories: Story = { args: { categories: MOCK_CATEGORIES.slice(0, 2), actionLink: null } };
