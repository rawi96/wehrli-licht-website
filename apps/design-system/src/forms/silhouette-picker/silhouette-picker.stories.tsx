import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { SilhouettePicker } from './silhouette-picker';

const meta: Meta = {
  title: 'Forms/SilhouettePicker',
  parameters: { docs: { description: { component: 'A choice of shapes, each as a silhouette with its name.' } } },
};

export default meta;
type Story = StoryObj;

const SHAPES = [
  { id: 'zylinder', label: 'Zylinder', path: 'M25,20L75,20L75,80L25,80Z' },
  { id: 'konisch', label: 'Konisch', path: 'M35,20L65,20L80,80L20,80Z' },
  { id: 'flach', label: 'Konisch flach', path: 'M40,35L60,35L90,65L10,65Z' },
  { id: 'pagode', label: 'Pagode mit langem Namen', path: 'M42,20L58,20Q60,70 85,80L15,80Q40,70 42,20Z' },
];

const DefaultDemo = () => {
  const [value, setValue] = useState('konisch');

  return (
    <div className="max-w-sm">
      <SilhouettePicker options={SHAPES} value={value} onChange={setValue} />
    </div>
  );
};

export const Default: Story = {
  render: () => <DefaultDemo />,
};
