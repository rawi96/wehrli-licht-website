import Image from 'next/image'
import Link from 'next/link'
import { TitleSection } from '../TitleSection'
import { BestsellerProps } from './types'

export const Bestsellers = ({ bestsellers }: BestsellerProps) => {
  return (
    <>
      <TitleSection title="Bestseller" />
      <div className="mb-20 mt-10 flex overflow-x-scroll">
        <div className="flex flex-nowrap gap-4">
          {bestsellers?.map((product) => (
            <Link href={`/shop/produkte/${product.slug}`} key={product.id}>
              <div className="group relative h-64 w-64 overflow-hidden rounded-lg">
                {product.images?.length && product.images[0].file?.url && (
                  <Image
                    src={product.images[0].file.url}
                    alt={product.name}
                    className="absolute h-full w-full object-cover transition-opacity group-hover:opacity-75"
                    width={256}
                    height={256}
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40" />
                <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-gray-900/10" />
                <div className="absolute bottom-0 left-0 right-0 flex flex-wrap items-center gap-y-1 overflow-hidden p-8 text-sm leading-6 text-gray-300">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-white">
                    <span className="absolute inset-0" />
                    {product.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
