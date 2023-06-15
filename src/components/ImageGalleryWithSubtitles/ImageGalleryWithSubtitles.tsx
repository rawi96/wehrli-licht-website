import Image from 'next/image'
import { ImageGalleryWithSubtitleProps } from './types'

export const ImageGalleryWithSubtitles = ({
  images,
}: ImageGalleryWithSubtitleProps) => {
  return (
    <div className="mb-20 grid grid-cols-1 items-center gap-4 md:grid-cols-3">
      {images.map((image, index) => (
        <div
          key={index}
          className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-80 sm:pt-48 lg:pt-80"
        >
          <Image
            className="absolute inset-0 -z-10 h-full w-full object-cover"
            src={image.src}
            alt={image.altText}
            width={1000}
            height={1000}
            sizes="(min-width: 1024px) 1000px, 100vw"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40" />
          <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10" />

          <h3 className="mt-3 text-lg font-semibold leading-6 text-white">
            <span className="absolute inset-0" />
            {image.altText}
          </h3>
        </div>
      ))}
    </div>
  )
}
