import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Logo } from './logo';

const meta: Meta<typeof Logo> = {
  title: 'Icons/Logo',
  component: Logo,
  decorators: [
    (Story) => (
      <div className="bg-wehrli inline-block p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Logo>;

export const Default: Story = {};
