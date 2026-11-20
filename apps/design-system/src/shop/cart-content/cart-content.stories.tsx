import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MOCK_CART_LINES } from '../shop.mocks';
import { CartContent } from './cart-content';

const meta: Meta<typeof CartContent> = {
  title: 'Shop/CartContent',
  component: CartContent,
  args: {
    items: MOCK_CART_LINES,
    subtotal: 'CHF 1’370.00',
    total: 'CHF 1’370.00',
    onQuantityChange: () => undefined,
    maxQuantity: 10,
    onRemove: () => undefined,
    onGoToCheckout: () => undefined,
    shopHref: '#',
  },
  decorators: [
    (Story) => (
      <div className="flex max-w-3xl flex-col rounded-lg bg-white py-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CartContent>;

export const Default: Story = {};

export const Empty: Story = { args: { items: [] } };

export const Loading: Story = { args: { loading: true } };
