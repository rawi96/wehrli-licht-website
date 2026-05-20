'use client';

import { CartContent } from '@/components/shop/cart-content';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { Fragment } from 'react';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const ShoppingCart = ({ open, setOpen }: Props) => {
  const router = useRouter();

  const handleGoToCheckout = () => {
    setOpen(false);
    router.push('/shop/checkout');
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="sm:bg-opacity-75 fixed inset-0 bg-gray-500 transition-opacity" />
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
                <div className="relative flex w-full flex-col overflow-hidden rounded bg-white pt-6 pb-8 sm:pb-6 lg:py-8">
                  <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Dialog.Title className="text-lg font-bold">Warenkorb</Dialog.Title>
                    <button type="button" className="text-gray-400 hover:text-gray-500" onClick={() => setOpen(false)}>
                      <span className="sr-only">Schliessen</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  <CartContent onGoToCheckout={handleGoToCheckout} onShopLinkClick={() => setOpen(false)} />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
