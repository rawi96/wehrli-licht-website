import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { RangeField } from './range-field';

const meta: Meta = {
  title: 'Forms/RangeField',
  parameters: { docs: { description: { component: 'A slider with label and value.' } } },
};

export default meta;
type Story = StoryObj;

const DefaultDemo = () => {
  const [value, setValue] = useState(28);

  return (
    <div className="max-w-sm">
      <RangeField label="Höhe" value={value} min={12} max={60} unit="cm" onChange={setValue} />
    </div>
  );
};

export const Default: Story = {
  render: () => <DefaultDemo />,
};

/** Label for screen readers only, no value: e.g. a dimmer next to an icon. */
const CompactDemo = () => {
  const [value, setValue] = useState(80);

  return (
    <div className="max-w-48">
      <RangeField label="Helligkeit" value={value} min={10} max={100} onChange={setValue} hideLabel />
    </div>
  );
};

export const Compact: Story = {
  render: () => <CompactDemo />,
};
