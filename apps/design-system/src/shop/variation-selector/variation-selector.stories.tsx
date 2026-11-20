import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { VariationSelector } from './variation-selector';

const OPTIONS = [
  { option: 'Farbe', values: ['Weiss', 'Schwarz', 'Messing'] },
  { option: 'Grösse', values: ['S', 'M', 'L'] },
];

const meta: Meta = {
  title: 'Shop/VariationSelector',
  component: VariationSelector,
};

export default meta;

const Example = () => {
  const [selected, setSelected] = useState<Record<string, string>>({ Farbe: 'Weiss', Grösse: 'S' });

  return (
    <div className="max-w-sm">
      <VariationSelector
        options={OPTIONS}
        selected={selected}
        onSelect={(option, value) => setSelected((previous) => ({ ...previous, [option]: value }))}
      />
    </div>
  );
};

export const Default: StoryObj = { render: () => <Example /> };
