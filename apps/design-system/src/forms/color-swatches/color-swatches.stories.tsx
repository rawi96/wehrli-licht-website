import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { ColorSwatches } from './color-swatches';

const meta: Meta = {
  title: 'Forms/ColorSwatches',
  parameters: { docs: { description: { component: 'Colour swatches, optionally with a free colour picker.' } } },
};

export default meta;
type Story = StoryObj;

const COLORS = [
  { id: 'weiss', label: 'Weiss', hex: '#f2eee6' },
  { id: 'sand', label: 'Sand', hex: '#c4ad88' },
  { id: 'salbei', label: 'Salbei', hex: '#98a98c' },
  { id: 'blau', label: 'Blau', hex: '#214073' },
];

const DefaultDemo = () => {
  const [value, setValue] = useState('#c4ad88');

  return <ColorSwatches colors={COLORS} value={value} onChange={setValue} />;
};

export const Default: Story = {
  render: () => <DefaultDemo />,
};

const WithoutPickerDemo = () => {
  const [value, setValue] = useState('#f2eee6');

  return <ColorSwatches colors={COLORS.slice(0, 2)} value={value} onChange={setValue} custom={false} />;
};

export const WithoutPicker: Story = {
  render: () => <WithoutPickerDemo />,
};
