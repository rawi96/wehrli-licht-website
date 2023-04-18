import Image from 'next/image'
import { ImageGalleryProps } from './types'

export const ImageGallery = ({ images }: ImageGalleryProps) => {
  return (
    <div className="mb-20 grid grid-cols-2 gap-4 md:grid-cols-3">
      {images.map((image, index) => (
        <div key={index}>
          <Image
            className="h-auto max-w-full rounded-lg"
            src={image.src}
            alt={image.altText}
            width={600}
            height={600}
          />
        </div>
      ))}
    </div>
  )
}
