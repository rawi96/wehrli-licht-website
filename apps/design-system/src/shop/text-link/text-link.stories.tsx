import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ShopTextLink } from './text-link';

const meta: Meta<typeof ShopTextLink> = {
  title: 'Shop/TextLink',
  component: ShopTextLink,
  args: { href: '#', label: 'Alle Leuchten' },
};

export default meta;
type Story = StoryObj<typeof ShopTextLink>;

export const Default: Story = {};

export const Inverted: Story = {
  args: { inverted: true },
  decorators: [
    (Story) => (
      <div className="bg-wehrli p-6">
        <Story />
      </div>
    ),
  ],
};
