import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { FilterChips } from './filter-chips';

const options = [
  { id: 'zuhause', label: 'Zuhause', count: 3 },
  { id: 'gastronomie', label: 'Gastronomie', count: 2 },
  { id: 'buero', label: 'Büro', count: 1 },
];

const meta: Meta<typeof FilterChips> = {
  title: 'Navigation/FilterChips',
  component: FilterChips,
};

export default meta;
type Story = StoryObj<typeof FilterChips>;

const Interactive = () => {
  const [value, setValue] = useState<string | null>(null);

  return <FilterChips options={options} value={value} onChange={setValue} />;
};

export const Default: Story = { render: () => <Interactive /> };
