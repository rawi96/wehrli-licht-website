'use client';

import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { FC, Fragment, ReactNode } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  /** The cart, usually CartContent. */
  children: ReactNode;
  labels?: { title: string; close: string };
};

const DEFAULT_LABELS = { title: 'Warenkorb', close: 'Schliessen' };

/** The cart as a modal dialog over the page. */
export const CartDialog: FC<Props> = ({ open, onClose, children, labels = DEFAULT_LABELS }) => (
  <Transition.Root show={open} as={Fragment}>
    <Dialog as="div" className="relative z-50" onClose={onClose}>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-gray-600 transition-opacity" />
      </Transition.Child>

      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-stretch justify-center p-4 text-center sm:items-center sm:px-6 lg:px-8">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-105"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-105"
          >
            <Dialog.Panel className="flex w-full max-w-3xl transform text-left text-base transition sm:my-8">
              <div className="relative flex w-full flex-col overflow-hidden rounded-md bg-white pt-6 pb-8 sm:pb-6 lg:py-8">
                <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
                  <Dialog.Title className="text-lg font-bold">{labels.title}</Dialog.Title>
                  <button type="button" className="hover:text-wehrli text-gray-600" onClick={onClose}>
                    <span className="sr-only">{labels.close}</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {children}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition.Root>
);
