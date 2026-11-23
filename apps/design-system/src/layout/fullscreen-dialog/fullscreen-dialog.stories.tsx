import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { Button } from '../../actions/button/button';
import { FullscreenDialog } from './fullscreen-dialog';

const Demo = () => {
  const [open, setOpen] = useState(true);

  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Öffnen
      </Button>
      <FullscreenDialog open={open} onClose={() => setOpen(false)} title="Titel des Dialogs">
        <div className="flex size-full items-center justify-center bg-gray-50 text-sm">Inhalt</div>
      </FullscreenDialog>
    </>
  );
};

const meta: Meta<typeof Demo> = {
  title: 'Layout/FullscreenDialog',
  component: Demo,
};

export default meta;
type Story = StoryObj<typeof Demo>;

export const Default: Story = {};
