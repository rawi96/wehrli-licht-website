import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CartButton } from './cart-button';

const meta: Meta<typeof CartButton> = {
  title: 'Shop/CartButton',
  component: CartButton,
  args: { quantity: 2, onClick: () => undefined },
  decorators: [
    (Story) => (
      <div className="bg-wehrli inline-flex p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CartButton>;

export const WithItems: Story = {};

export const Empty: Story = { args: { quantity: 0 } };

export const ManyItems: Story = { args: { quantity: 120 } };
