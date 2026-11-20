import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { MOCK_SHIPPING_OPTIONS } from '../shop.mocks';
import { RadioCards } from './radio-cards';

const meta: Meta = {
  title: 'Shop/RadioCards',
  component: RadioCards,
};

export default meta;

const Example = () => {
  const [value, setValue] = useState('pickup');

  return (
    <div className="max-w-xl">
      <RadioCards name="shipping" legend="Versandart" options={MOCK_SHIPPING_OPTIONS} value={value} onChange={setValue} />
    </div>
  );
};

export const Default: StoryObj = { render: () => <Example /> };
