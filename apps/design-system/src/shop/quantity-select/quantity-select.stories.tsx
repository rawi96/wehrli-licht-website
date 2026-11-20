import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { QuantitySelect } from './quantity-select';

const meta: Meta = {
  title: 'Shop/QuantitySelect',
  component: QuantitySelect,
};

export default meta;

const Example = ({ variant }: { variant: 'bold' | 'field' }) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="w-48">
      <QuantitySelect id={`quantity-${variant}`} value={quantity} onChange={setQuantity} label="Anzahl" variant={variant} />
    </div>
  );
};

export const Bold: StoryObj = { render: () => <Example variant="bold" /> };

export const Field: StoryObj = { render: () => <Example variant="field" /> };
