import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Paragraph, RichText } from '../../typography/rich-text/rich-text';
import { MOCK_PRODUCT_IMAGES } from '../shop.mocks';
import { VariationSelector } from '../variation-selector/variation-selector';
import { ProductDetail } from './product-detail';

const meta: Meta<typeof ProductDetail> = {
  title: 'Shop/ProductDetail',
  component: ProductDetail,
  args: {
    name: 'Pendelleuchte',
    images: MOCK_PRODUCT_IMAGES.map((image, index) => ({ id: String(index), image })),
    price: 'CHF 290.00',
    deliveryTime: '2–3 Wochen',
    shippingCost: 'CHF 15.00',
    variations: (
      <VariationSelector
        options={[{ option: 'Farbe', values: ['Weiss', 'Schwarz'] }]}
        selected={{ Farbe: 'Weiss' }}
        onSelect={() => undefined}
      />
    ),
    onAddToCart: () => undefined,
    viewingHref: '#',
    questionHref: '#',
    description: (
      <RichText>
        <Paragraph>Eine schlichte Pendelleuchte aus mundgeblasenem Glas, die über dem Esstisch warmes Licht gibt.</Paragraph>
      </RichText>
    ),
    specs: [
      { label: 'Dimmbar', value: 'Ja' },
      { label: 'Leistung', value: '12 W' },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof ProductDetail>;

export const Default: Story = {};

export const Minimal: Story = {
  args: {
    images: [],
    deliveryTime: null,
    shippingCost: 'Gratis',
    variations: null,
    questionHref: null,
    description: null,
    specs: [],
  },
};
