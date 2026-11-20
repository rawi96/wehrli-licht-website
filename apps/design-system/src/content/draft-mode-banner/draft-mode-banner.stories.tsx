import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { DraftModeBanner } from './draft-mode-banner';

const meta: Meta<typeof DraftModeBanner> = {
  title: 'Content/DraftModeBanner',
  component: DraftModeBanner,
  parameters: { layout: 'fullscreen' },
  args: { disableHref: '#' },
};

export default meta;
type Story = StoryObj<typeof DraftModeBanner>;

export const Default: Story = {};
