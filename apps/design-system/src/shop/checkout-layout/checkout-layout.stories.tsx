import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CheckoutCartSummary } from '../checkout-cart-summary/checkout-cart-summary';
import { CheckoutErrorAlert } from '../checkout-error-alert/checkout-error-alert';
import { CheckoutShippingStep } from '../checkout-shipping-step/checkout-shipping-step';
import { CheckoutSteps } from '../checkout-steps/checkout-steps';
import { MOCK_CART_LINES, MOCK_CHECKOUT_STEPS, MOCK_SHIPPING_OPTIONS } from '../shop.mocks';
import { CheckoutLayout, CheckoutLoading } from './checkout-layout';

const meta: Meta<typeof CheckoutLayout> = {
  title: 'Shop/CheckoutLayout',
  component: CheckoutLayout,
  args: {
    title: 'Versandart',
    sidebar: (
      <CheckoutCartSummary
        items={MOCK_CART_LINES}
        subtotal="CHF 1’370.00"
        onQuantityChange={() => undefined}
        maxQuantity={10}
        onRemove={() => undefined}
      />
    ),
    steps: <CheckoutSteps steps={MOCK_CHECKOUT_STEPS} currentStep="shipping" />,
    children: (
      <CheckoutShippingStep
        options={MOCK_SHIPPING_OPTIONS}
        value="pickup"
        onChange={() => undefined}
        backHref="#"
        onContinue={() => undefined}
      />
    ),
  },
};

export default meta;
type Story = StoryObj<typeof CheckoutLayout>;

export const Default: Story = {};

export const WithAlert: Story = {
  args: {
    alert: <CheckoutErrorAlert message="Die Bestellung konnte nicht abgeschlossen werden." contactHref="#" />,
  },
};

export const Loading: Story = { render: () => <CheckoutLoading title="Kasse" text="Laden…" /> };
