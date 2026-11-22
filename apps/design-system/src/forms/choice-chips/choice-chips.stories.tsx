import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { ChoiceChips } from './choice-chips';

const meta: Meta = {
  title: 'Forms/ChoiceChips',
  parameters: { docs: { description: { component: 'A choice from a few options as round chips.' } } },
};

export default meta;
type Story = StoryObj;

const MATERIALS = [
  { id: 'leinen', label: 'Leinen' },
  { id: 'seide', label: 'Seide' },
  { id: 'pergament', label: 'Pergament' },
  { id: 'leder', label: 'Leder' },
];

const DefaultDemo = () => {
  const [value, setValue] = useState('leinen');

  return <ChoiceChips options={MATERIALS} value={value} onChange={setValue} label="Material" />;
};

export const Default: Story = {
  render: () => <DefaultDemo />,
};

/** Without a value the chips are plain buttons, here in one scrolling row. */
export const Buttons: Story = {
  render: () => (
    <div className="w-80 px-5">
      <ChoiceChips options={[...MATERIALS, { id: 'baumwolle', label: 'Baumwolle' }]} onChange={() => undefined} scroll />
    </div>
  ),
};
