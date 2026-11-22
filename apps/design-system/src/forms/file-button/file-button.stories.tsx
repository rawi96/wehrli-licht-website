import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FileButton } from './file-button';

const meta: Meta<typeof FileButton> = {
  title: 'Forms/FileButton',
  component: FileButton,
  args: { label: 'Eigenes Bild wählen', accept: 'image/*', onFile: () => undefined },
};

export default meta;
type Story = StoryObj<typeof FileButton>;

export const Default: Story = {};

export const Active: Story = { args: { label: 'Anderes Bild wählen', active: true } };
