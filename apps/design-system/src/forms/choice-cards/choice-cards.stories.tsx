import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { ChoiceCards } from './choice-cards';

const OPTIONS = [
  { id: 'a', label: 'Erste Option', description: 'Eine kurze Erklärung.' },
  { id: 'b', label: 'Zweite Option', description: 'Noch eine kurze Erklärung.' },
  { id: 'c', label: 'Dritte Option' },
];

const dot = (color: string) => <span className="block size-10 rounded-full" style={{ backgroundColor: color }} />;

const Demo = ({ layout }: { layout: 'row' | 'tile' }) => {
  const [value, setValue] = useState('a');

  return (
    <div className="max-w-sm">
      <ChoiceCards
        label="Auswahl"
        layout={layout}
        value={value}
        onChange={setValue}
        options={OPTIONS.map((option, index) => ({ ...option, visual: dot(['#214073', '#c9a45c', '#8a7a68'][index]) }))}
      />
    </div>
  );
};

const meta: Meta<typeof Demo> = {
  title: 'Forms/ChoiceCards',
  component: Demo,
  args: { layout: 'row' },
};

export default meta;
type Story = StoryObj<typeof Demo>;

export const Rows: Story = {};

export const Tiles: Story = { args: { layout: 'tile' } };
