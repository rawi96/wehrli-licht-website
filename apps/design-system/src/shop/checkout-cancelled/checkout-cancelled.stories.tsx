import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CheckoutCancelled } from './checkout-cancelled';

const meta: Meta<typeof CheckoutCancelled> = {
  title: 'Shop/CheckoutCancelled',
  component: CheckoutCancelled,
  args: { shopHref: '#' },
};

export default meta;
type Story = StoryObj<typeof CheckoutCancelled>;

export const Default: Story = {};
