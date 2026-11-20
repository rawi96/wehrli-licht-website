import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ProductSpecs } from './product-specs';

const meta: Meta<typeof ProductSpecs> = {
  title: 'Shop/ProductSpecs',
  component: ProductSpecs,
  args: {
    rows: [
      { label: 'Dimmbar', value: 'Ja' },
      { label: 'Leistung', value: '12 W' },
      { label: 'Lichtfarbe', value: '2700 K, warmweiss' },
      { label: 'Masse', value: 'Durchmesser 40 cm, Höhe 25 cm, Kabellänge bis 200 cm, kürzbar' },
    ],
  },
  decorators: [
    (Story) => (
      <div className="max-w-xl">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ProductSpecs>;

export const Default: Story = {};
