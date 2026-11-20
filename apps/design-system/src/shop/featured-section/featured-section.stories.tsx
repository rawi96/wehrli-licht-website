import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MOCK_PRODUCTS } from '../shop.mocks';
import { ShopFeaturedSection } from './featured-section';

const meta: Meta<typeof ShopFeaturedSection> = {
  title: 'Shop/FeaturedSection',
  component: ShopFeaturedSection,
  parameters: { layout: 'fullscreen' },
  args: {
    headingId: 'featured-heading',
    title: 'Empfohlene Leuchten',
    intro: (
      <p>
        Unsere Auswahl für <strong>diese Saison</strong>.
      </p>
    ),
    actionLink: { href: '#', label: 'Alle Leuchten' },
    products: [...MOCK_PRODUCTS, ...MOCK_PRODUCTS.map((product) => ({ ...product, id: `${product.id}-2` }))],
  },
};

export default meta;
type Story = StoryObj<typeof ShopFeaturedSection>;

export const Default: Story = {};

export const OneProduct: Story = { args: { products: MOCK_PRODUCTS.slice(0, 1), intro: undefined } };
