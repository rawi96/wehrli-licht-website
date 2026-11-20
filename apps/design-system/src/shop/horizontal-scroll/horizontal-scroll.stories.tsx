import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ProductCard } from '../product-card/product-card';
import { MOCK_PRODUCTS } from '../shop.mocks';
import { HorizontalScroll, HorizontalScrollItem } from './horizontal-scroll';

const meta: Meta<typeof HorizontalScroll> = {
  title: 'Shop/HorizontalScroll',
  component: HorizontalScroll,
  args: { label: 'Empfohlene Leuchten' },
  render: (args) => (
    <HorizontalScroll {...args}>
      {[...MOCK_PRODUCTS, ...MOCK_PRODUCTS.map((product) => ({ ...product, id: `${product.id}-2` }))].map((product) => (
        <HorizontalScrollItem key={product.id}>
          <ProductCard {...product} variant="compact" />
        </HorizontalScrollItem>
      ))}
    </HorizontalScroll>
  ),
};

export default meta;
type Story = StoryObj<typeof HorizontalScroll>;

export const Default: Story = {};

export const MobileEdgeBleed: Story = {
  args: { mobileEdgeBleed: true, spaced: true },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
