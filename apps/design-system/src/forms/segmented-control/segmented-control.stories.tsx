import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { SegmentedControl } from './segmented-control';

const meta: Meta = {
  title: 'Forms/SegmentedControl',
  parameters: {
    docs: { description: { component: 'One choice from a few options as a pill bar, e.g. on top of a 3D view.' } },
    backgrounds: { default: 'gray' },
  },
};

export default meta;
type Story = StoryObj;

const WithIconsDemo = () => {
  const [value, setValue] = useState('abend');

  return (
    <SegmentedControl
      label="Tageszeit"
      value={value}
      onChange={setValue}
      options={[
        { id: 'tag', label: 'Tag', icon: 'sun' },
        { id: 'abend', label: 'Abend', icon: 'moon' },
      ]}
    />
  );
};

export const WithIcons: Story = {
  render: () => <WithIconsDemo />,
};

const SmallDemo = () => {
  const [value, setValue] = useState(2700);

  return (
    <div className="w-56">
      <SegmentedControl
        label="Lichtfarbe"
        size="small"
        value={value}
        onChange={setValue}
        options={[2200, 2700, 3000, 4000].map((kelvin) => ({ id: kelvin, label: `${kelvin} K` }))}
      />
    </div>
  );
};

export const Small: Story = {
  render: () => <SmallDemo />,
};
