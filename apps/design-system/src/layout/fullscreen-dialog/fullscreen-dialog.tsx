'use client';

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { FC, ReactNode } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  /** Shown in the bar at the top. */
  title: string;
  /** Fills the space below the bar, e.g. a ConfiguratorShell. */
  children: ReactNode;
  closeLabel?: string;
};

/**
 * A dialog over the whole screen with a slim bar (title, «Schliessen») on top, e.g. for a configurator. Escape and
 * the close button close it; focus stays inside while it is open (Headless UI).
 */
export const FullscreenDialog: FC<Props> = ({ open, onClose, title, children, closeLabel = 'Schliessen' }) => (
  <Dialog open={open} onClose={onClose} className="relative z-50">
    <DialogPanel
      transition
      className="fixed inset-0 flex flex-col bg-white transition duration-300 ease-out data-closed:translate-y-6 data-closed:opacity-0 motion-reduce:transition-none"
    >
      <div className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-gray-200 px-4 sm:px-5">
        <DialogTitle className="text-wehrli truncate text-sm font-bold">{title}</DialogTitle>
        <button
          type="button"
          onClick={onClose}
          className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold text-gray-600 hover:bg-gray-100 hover:text-black"
        >
          <XMarkIcon className="size-5" aria-hidden="true" />
          {closeLabel}
        </button>
      </div>
      <div className="min-h-0 flex-1">{children}</div>
    </DialogPanel>
  </Dialog>
);
