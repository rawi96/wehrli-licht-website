import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SocialIcon } from './social-icon';

const meta: Meta<typeof SocialIcon> = {
  title: 'Icons/SocialIcon',
  component: SocialIcon,
  args: { network: 'linkedin' },
  decorators: [
    (Story) => (
      <div className="bg-wehrli inline-block p-4 text-white">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SocialIcon>;

export const LinkedIn: Story = {};

export const Instagram: Story = { args: { network: 'instagram' } };

export const Facebook: Story = { args: { network: 'facebook' } };
