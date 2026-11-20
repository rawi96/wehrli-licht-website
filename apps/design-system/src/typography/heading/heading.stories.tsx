import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Heading } from './heading';

const meta: Meta<typeof Heading> = {
  title: 'Typography/Heading',
  component: Heading,
  args: { children: 'Licht, das Räume verändert' },
};

export default meta;
type Story = StoryObj<typeof Heading>;

export const Levels: Story = {
  render: (args) => (
    <>
      <Heading {...args} level="1" />
      <Heading {...args} level="2" />
      <Heading {...args} level="3" />
    </>
  ),
};

export const White: Story = {
  args: { level: '2', color: 'white' },
  decorators: [
    (Story) => (
      <div className="bg-wehrli p-6">
        <Story />
      </div>
    ),
  ],
};
