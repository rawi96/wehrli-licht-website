import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { IconButton } from './icon-button';

const meta: Meta<typeof IconButton> = {
  title: 'Actions/IconButton',
  component: IconButton,
  args: { icon: 'share', label: 'Teilen', onClick: () => undefined },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {};

export const Pressed: Story = { args: { icon: 'measure', label: 'Masse anzeigen', pressed: true } };

export const AllIcons: Story = {
  render: () => (
    <div className="flex gap-2">
      <IconButton icon="sparkles" label="Zufall" onClick={() => undefined} />
      <IconButton icon="measure" label="Masse" onClick={() => undefined} />
      <IconButton icon="download" label="Bild speichern" onClick={() => undefined} />
      <IconButton icon="share" label="Teilen" onClick={() => undefined} />
    </div>
  ),
};
