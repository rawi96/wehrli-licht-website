import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { MoreOptions } from './more-options';

const meta: Meta<typeof MoreOptions> = {
  title: 'Forms/MoreOptions',
  component: MoreOptions,
  args: { label: 'Genau einstellen', children: <p className="text-sm">Weitere Einstellungen</p> },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MoreOptions>;

export const Default: Story = {};
