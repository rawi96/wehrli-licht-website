'use client';

import { useShopContext } from '@/app/context/shop-context';
import { formatPriceToCHF } from '@/utils/price';
import { initSwell, removeCartItem, updateCartItem } from '@/utils/shop';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { ChangeEvent, Fragment, useState } from 'react';
import { CartItem } from 'swell-js';
import { Button } from '../button';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const ShoppingCart = ({ open, setOpen }: Props) => {
  const { shoppingCart, setShoppingCart } = useShopContext();
  const [isLoading, setIsLoading] = useState<boolean>();

  const handleSelectChange = async (event: ChangeEvent<HTMLSelectElement>, item: CartItem) => {
    if (!item.id) {
      console.error('Item does not have an ID.');

      return;
    }

    setIsLoading(true);

    initSwell();

    const updatedCart = await updateCartItem(item.id, parseInt(event.target.value));

    if ('errors' in updatedCart) {
      console.error('Failed to update cart item:', updatedCart.errors);
    } else {
      setShoppingCart(updatedCart);
    }

    setIsLoading(false);
  };

  const handleDeleteItem = async (item: CartItem) => {
    if (!item.id) {
      console.error('Item does not have an ID.');

      return;
    }

    setIsLoading(true);

    initSwell();

    const updatedCart = await removeCartItem(item.id);

    if ('errors' in updatedCart) {
      console.error('Failed to remove item from cart:', updatedCart.errors);
    } else {
      setShoppingCart(updatedCart);
    }

    setIsLoading(false);
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
          <div className="hidden sm:fixed sm:inset-0 sm:block sm:bg-gray-500 sm:bg-opacity-75 sm:transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-stretch justify-center text-center sm:items-center sm:px-6 lg:px-8">
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
                {shoppingCart && (
                  <div className="relative flex w-full flex-col overflow-hidden bg-white pb-8 pt-6 sm:rounded sm:pb-6 lg:py-8">
                    <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
                      <h2 className="text-lg font-bold">Warenkorb</h2>
                      <button type="button" className="text-gray-400 hover:text-gray-500" onClick={() => setOpen(false)}>
                        <span className="sr-only">Schliessen</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>

                    <section aria-labelledby="cart-heading">
                      <h2 id="cart-heading" className="sr-only">
                        Produkte im Warenkorb
                      </h2>

                      <ul role="list" className="divide-y divide-gray-200 px-4 sm:px-6 lg:px-8">
                        {shoppingCart.items?.length === 0 && <p>Sie haben keine Produkte im Warenkorb.</p>}
                        {shoppingCart.items?.map((item, productIdx) => (
                          <li key={item.id} className="flex py-8 text-sm sm:items-center">
                            {item.product?.images?.[0].file?.url && (
                              <Image
                                src={item.product.images[0].file?.url}
                                alt={item.product.name}
                                className="h-24 w-24 flex-none rounded border border-gray-200 sm:h-32 sm:w-32"
                                width={1000}
                                height={1000}
                              />
                            )}

                            <div className="ml-4 grid flex-auto grid-cols-1 grid-rows-1 items-start gap-x-5 gap-y-3 sm:ml-6 sm:flex sm:items-center sm:gap-0">
                              <div className="row-end-1 flex-auto sm:pr-6">
                                <h3 className="font-bold">
                                  <Link href={`/shop/produkte/${item.product?.slug}`}>{item.product?.name}</Link>
                                  {item.options && (
                                    <p className="pt-3 font-normal">
                                      {item.options.map((option) => `${option.name}: ${option.value}`).join(', ')}
                                    </p>
                                  )}
                                </h3>
                              </div>
                              <p className="row-span-2 row-end-2 font-bold sm:order-1 sm:ml-6 sm:w-1/3 sm:flex-none sm:text-right">
                                {formatPriceToCHF(item.price)}
                              </p>
                              <div className="flex items-center sm:block sm:flex-none sm:text-center">
                                <label htmlFor={`quantity-${productIdx}`} className="sr-only">
                                  Anzahl, {item.quantity}
                                </label>
                                <select
                                  id={`quantity-${productIdx}`}
                                  name={`quantity-${productIdx}`}
                                  defaultValue={item.quantity}
                                  className="block max-w-full rounded border border-gray-300 py-1.5 text-left text-base font-bold leading-5 shadow-sm focus:border-wehrli-500 focus:outline-none focus:ring-1 focus:ring-wehrli-500 sm:text-sm"
                                  onChange={(event) => handleSelectChange(event, item)}
                                >
                                  <option value={1}>1</option>
                                  <option value={2}>2</option>
                                  <option value={3}>3</option>
                                  <option value={4}>4</option>
                                  <option value={5}>5</option>
                                  <option value={6}>6</option>
                                  <option value={7}>7</option>
                                  <option value={8}>8</option>
                                  <option value={9}>9</option>
                                  <option value={10}>10</option>
                                </select>

                                <button
                                  type="button"
                                  className={`ml-4 font-bold ${
                                    isLoading ? '' : 'text-wehrli'
                                  } hover:text-wehrli-600 sm:ml-0 sm:mt-2`}
                                  onClick={() => handleDeleteItem(item)}
                                  disabled={isLoading}
                                >
                                  <span className="">Entfernen</span>
                                </button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </section>
                    {shoppingCart.items?.length !== 0 && (
                      <section aria-labelledby="summary-heading" className="mt-auto sm:px-6 lg:px-8">
                        <div className="bg-gray-50 p-6 sm:rounded sm:p-8">
                          <h2 id="summary-heading" className="sr-only">
                            Bestellübersicht
                          </h2>

                          <div className="flow-root">
                            <dl className="-my-4 divide-y divide-gray-200 text-sm">
                              <div className="flex items-center justify-between py-4">
                                <dt className="">Zwischentotal</dt>
                                <dd className="">{isLoading ? '...' : `CHF ${shoppingCart.sub_total}`}</dd>
                              </div>
                              <div className="flex items-center justify-between py-4">
                                <dt className="">Versand</dt>
                                <dd className="">{isLoading ? '...' : `CHF ${shoppingCart.shipment_price}`}</dd>
                              </div>

                              <div className="flex items-center justify-between py-4">
                                <dt className="text-base font-bold">Total</dt>
                                <dd className="text-base font-bold">
                                  {isLoading ? '...' : `CHF ${shoppingCart.grand_total}`}
                                </dd>
                              </div>
                            </dl>
                          </div>
                        </div>
                      </section>
                    )}
                    <div className="mt-8 flex justify-end px-4 sm:px-6 lg:px-8">
                      {shoppingCart?.item_quantity && shoppingCart.item_quantity > 0 ? (
                        <Button loading={isLoading} type="primary" text="Zur Kasse" href={shoppingCart.checkout_url} />
                      ) : null}
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
