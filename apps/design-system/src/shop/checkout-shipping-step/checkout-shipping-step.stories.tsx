import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { MOCK_SHIPPING_OPTIONS } from '../shop.mocks';
import { CheckoutShippingStep } from './checkout-shipping-step';

const meta: Meta = {
  title: 'Shop/CheckoutShippingStep',
  component: CheckoutShippingStep,
};

export default meta;

const Example = () => {
  const [value, setValue] = useState('pickup');

  return (
    <div className="max-w-xl">
      <CheckoutShippingStep
        options={MOCK_SHIPPING_OPTIONS}
        value={value}
        onChange={setValue}
        deliveryTime="2–3 Wochen"
        backHref="#"
        onContinue={() => undefined}
      />
    </div>
  );
};

export const Default: StoryObj = { render: () => <Example /> };
