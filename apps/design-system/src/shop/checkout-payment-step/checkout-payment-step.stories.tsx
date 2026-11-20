import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { MOCK_PAYMENT_OPTIONS } from '../shop.mocks';
import { CheckoutPaymentStep } from './checkout-payment-step';

const meta: Meta = {
  title: 'Shop/CheckoutPaymentStep',
  component: CheckoutPaymentStep,
};

export default meta;

const Example = ({ error }: { error?: string }) => {
  const [value, setValue] = useState('prepayment');

  return (
    <div className="max-w-xl">
      <CheckoutPaymentStep
        options={MOCK_PAYMENT_OPTIONS}
        value={value}
        onChange={setValue}
        error={error}
        onBack={() => undefined}
        onContinue={() => undefined}
      />
    </div>
  );
};

export const Default: StoryObj = { render: () => <Example /> };

export const WithError: StoryObj = { render: () => <Example error="Bitte wählen Sie eine Zahlungsart." /> };
