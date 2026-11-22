import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Tabs } from './tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Navigation/Tabs',
  component: Tabs,
  args: {
    label: 'Gestalten',
    items: [
      { id: 'form', label: 'Form', content: <p className="text-sm">Formen</p> },
      { id: 'groesse', label: 'Grösse', content: <p className="text-sm">Masse</p> },
      { id: 'material', label: 'Material', content: <p className="text-sm">Materialien</p> },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {};

export const ManyTabs: Story = {
  render: (args) => (
    <div className="w-80 bg-white">
      <Tabs
        {...args}
        items={['Form', 'Grösse', 'Material', 'Farbe', 'Details', 'Leuchte'].map((label) => ({
          id: label,
          label,
          content: <p className="text-sm">{label}</p>,
        }))}
      />
    </div>
  ),
};
