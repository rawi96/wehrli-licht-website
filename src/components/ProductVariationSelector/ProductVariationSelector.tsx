import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { Fragment, useEffect } from 'react'
import { Variant } from 'swell-js'
import { ProductVariationSelectorProps } from './types'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export const ProductVariationSelector = ({
  product,
  activeVariant,
  setActiveVariant,
}: ProductVariationSelectorProps) => {
  const variants = product?.variants as unknown as {
    count: number
    results: Variant[]
  }

  const handleVariantSelect = (variant: Variant) => {
    setActiveVariant(variant)
  }

  useEffect(() => {
    const cheapestVariant = variants.results?.reduce((prev, current) => {
      if (!prev.price || !current.price) {
        return current
      }
      return prev.price < current.price ? prev : current
    })

    setActiveVariant(cheapestVariant)
  }, [variants.results, setActiveVariant])

  return (
    <>
      <div className="mb-2">
        <label className="text-lg font-bold">Ausführung</label>
      </div>
      <Menu as="div" className="relative inline-block w-full text-left">
        <div>
          <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            {activeVariant
              ? `${activeVariant.name} (CHF ${activeVariant.price}.-)`
              : 'Ausführung wählen'}
            <ChevronDownIcon
              className="-mr-1 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 w-56 w-full origin-top-right cursor-pointer rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {variants.results?.map((variant) => (
                <Menu.Item key={variant.id}>
                  <span
                    className={classNames(
                      variant.id === activeVariant?.id
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-700',
                      'block px-4 py-2 text-sm hover:bg-gray-100'
                    )}
                    onClick={() => handleVariantSelect(variant)}
                  >
                    {`${variant.name} (CHF ${variant.price}.-)`}
                  </span>
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  )
}
