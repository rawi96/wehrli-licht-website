import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MOCK_CATEGORIES, MOCK_PRODUCT_IMAGES } from '../shop.mocks';
import { CategoryNav, CategoryNavLink } from './category-nav';

const LINKS: CategoryNavLink[] = [
  { id: 'all', label: 'Alle Leuchten', href: '#' },
  ...MOCK_CATEGORIES.map((category, index) => ({
    id: category.id,
    label: category.name,
    href: '#',
    active: index === 1,
    thumbnailSrc: index < 2 ? MOCK_PRODUCT_IMAGES[index].src : undefined,
  })),
];

const meta: Meta<typeof CategoryNav> = {
  title: 'Shop/CategoryNav',
  component: CategoryNav,
  args: { links: LINKS, variant: 'sidebar' },
};

export default meta;
type Story = StoryObj<typeof CategoryNav>;

export const Sidebar: Story = {
  decorators: [
    (Story) => (
      <div className="w-56">
        <Story />
      </div>
    ),
  ],
};

export const Mobile: Story = {
  args: { variant: 'mobile' },
  decorators: [
    (Story) => (
      <div className="bg-wehrli max-w-sm px-6 pb-4">
        <Story />
      </div>
    ),
  ],
};
