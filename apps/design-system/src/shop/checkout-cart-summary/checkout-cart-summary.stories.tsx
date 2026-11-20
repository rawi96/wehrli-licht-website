import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MOCK_CART_LINES } from '../shop.mocks';
import { CheckoutCartSummary } from './checkout-cart-summary';

const meta: Meta<typeof CheckoutCartSummary> = {
  title: 'Shop/CheckoutCartSummary',
  component: CheckoutCartSummary,
  args: {
    items: MOCK_CART_LINES,
    subtotal: 'CHF 1’370.00',
    shippingCost: 'CHF 45.00',
    total: 'CHF 1’415.00',
    deliveryTime: 'Je nach Produkt unterschiedlich',
    onQuantityChange: () => undefined,
    onRemove: () => undefined,
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CheckoutCartSummary>;

export const Default: Story = {};

export const BeforeShipping: Story = { args: { shippingCost: null, total: null, deliveryTime: null } };
