import { Dialog, Transition } from '@headlessui/react'
import Image from 'next/image'
import { Fragment, useState } from 'react'
import { global } from '../../data/global'
import { Button } from '../Button'

export const HolidayModal = () => {
  const [open, setOpen] = useState(true)

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
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <Image
                    height={1000}
                    width={1000}
                    src="/images/vacation/winter.jpg"
                    alt="Ferien"
                  />
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="leading- text-xl font-semibold"
                    >
                      Wir machen Ferien
                    </Dialog.Title>
                    <div className="mt-4">
                      <div className="text-sm">
                        <div>
                          Vom{' '}
                          <strong>{`${global.holidaysStart} bis ${global.holidaysEnd}`}</strong>{' '}
                          bleibt das Geschäft geschlossen.
                        </div>
                        <div className="mt-4">
                          Nach Voranmeldung sind wir natürlich sehr gerne für
                          Sie da!
                        </div>
                        <div className="mt-4">
                          Erreichbar unter{' '}
                          <a
                            className="font-semibold underline"
                            href="mailto:info@wehrli-licht.ch"
                          >
                            info@wehrli-licht.ch
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <Button
                    text="Schliessen"
                    type="primary"
                    onClick={() => setOpen(false)}
                    fullWidth
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
