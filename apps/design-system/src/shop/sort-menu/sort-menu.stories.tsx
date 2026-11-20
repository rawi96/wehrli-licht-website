import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { SortMenu } from './sort-menu';

const OPTIONS = [
  { value: 'featured', label: 'Empfohlen' },
  { value: 'name-asc', label: 'Name A–Z' },
  { value: 'price-asc', label: 'Preis aufsteigend' },
];

const meta: Meta = {
  title: 'Shop/SortMenu',
  component: SortMenu,
};

export default meta;

const Example = () => {
  const [value, setValue] = useState('featured');

  return (
    <div className="flex justify-end">
      <SortMenu options={OPTIONS} value={value} onChange={setValue} />
    </div>
  );
};

export const Default: StoryObj = { render: () => <Example /> };
