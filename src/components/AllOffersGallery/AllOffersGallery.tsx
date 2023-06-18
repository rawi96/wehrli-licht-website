import Image from 'next/image'
import Link from 'next/link'
import { offerItems } from '../../data/offerItems'
import { AnalyticsListener } from '../AnalyticsListener'

export const AllOffersGallery = () => {
  return (
    <>
      <div className="mx-auto mb-32 mt-12 grid gap-6 bg-white md:grid-cols-2 lg:max-w-none lg:grid-cols-3">
        {offerItems.map((offer) => (
          <AnalyticsListener
            key={offer.title}
            buttonName={offer.title}
            className="relative flex flex-col overflow-hidden rounded-lg shadow-lg transition-shadow hover:shadow-2xl"
          >
            <Link href={offer.href} key={offer.title}>
              <div className="flex-shrink-0">
                <Image
                  alt={offer.title}
                  style={{ objectFit: 'cover' }}
                  className="h-48 w-full object-cover"
                  src={offer.imageUrl}
                  width={512}
                  height={192}
                  sizes="(min-width: 1024px) 512px, 100vw"
                />
              </div>
              <div className=" flex flex-1 flex-col justify-between bg-white p-6 pb-12">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-wehrli">
                    {offer.title}
                  </h3>
                  <p className="mt-3 pb-4 text-base text-gray-500">
                    {offer.description}
                  </p>
                </div>
                <p className="absolute bottom-4 text-gray-500 underline">
                  weiterlesen
                </p>
              </div>
            </Link>
          </AnalyticsListener>
        ))}
      </div>
    </>
  )
}
