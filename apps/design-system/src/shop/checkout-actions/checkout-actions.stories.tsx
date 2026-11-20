import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CheckoutActions } from './checkout-actions';

const meta: Meta<typeof CheckoutActions> = {
  title: 'Shop/CheckoutActions',
  component: CheckoutActions,
  args: { onBack: () => undefined, onNext: () => undefined, nextLabel: 'Weiter' },
  decorators: [
    (Story) => (
      <div className="max-w-xl">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CheckoutActions>;

export const Default: Story = {};

export const Submitting: Story = { args: { nextLabel: 'Bestellung abschliessen', loading: true } };

export const Disabled: Story = { args: { nextLabel: 'Bestellung abschliessen', disabled: true } };
