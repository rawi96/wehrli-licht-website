import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Grid } from './grid';

const meta: Meta<typeof Grid> = {
  title: 'Layout/Grid',
  component: Grid,
  argTypes: { cols: { control: { type: 'number', min: 1, max: 6 } } },
  args: { cols: 3 },
  render: ({ cols }) => (
    <Grid cols={cols}>
      {Array.from({ length: cols }, (_, index) => (
        <div key={index} className="bg-wehrli-50 rounded-sm p-6 text-sm text-white">
          Item {index + 1}
        </div>
      ))}
    </Grid>
  ),
};

export default meta;
type Story = StoryObj<typeof Grid>;

export const TwoColumns: Story = { args: { cols: 2 } };

export const ThreeColumns: Story = {};

export const FiveItems: Story = { args: { cols: 5 } };
