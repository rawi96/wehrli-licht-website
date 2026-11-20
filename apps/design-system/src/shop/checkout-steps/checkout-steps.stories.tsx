import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MOCK_CHECKOUT_STEPS } from '../shop.mocks';
import { CheckoutSteps } from './checkout-steps';

const meta: Meta<typeof CheckoutSteps> = {
  title: 'Shop/CheckoutSteps',
  component: CheckoutSteps,
  args: { steps: MOCK_CHECKOUT_STEPS, currentStep: 'shipping' },
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CheckoutSteps>;

export const FirstStep: Story = {};

export const ThirdStep: Story = { args: { currentStep: 'payment' } };

export const LastStep: Story = { args: { currentStep: 'review' } };
