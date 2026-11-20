'use client';

import { Tab } from '@headlessui/react';
import { FC } from 'react';
import { Image, ImageData } from '../../content/image/image';
import { cn } from '../../fundamentals/cn';

export type GalleryImage = {
  /** Unique key, e.g. the image URL. */
  id: string;
  image?: ImageData | null;
};

type Props = {
  images: GalleryImage[];
  /** Accessible name of each thumbnail tab, usually the product name. */
  label: string;
};

/** Two columns from lg (gallery = half of the max-w-7xl content), max-w-2xl below. */
const PRODUCT_IMAGE_SIZES = '(min-width: 1400px) 620px, (min-width: 1024px) 46vw, (min-width: 768px) 672px, 92vw';
/** Thumbnails: 4 per row from sm, 2 per row below. */
const PRODUCT_THUMB_SIZES = '(min-width: 640px) 160px, 46vw';

/** Product photos: the large image with thumbnails below that switch it (tabs). The first image is the LCP image. */
export const ProductGallery: FC<Props> = ({ images, label }) => (
  <Tab.Group as="div" className="flex flex-col-reverse">
    <div className="mx-auto mt-6 w-full max-w-2xl lg:max-w-none">
      <Tab.List className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {images.map(({ id, image }) => (
          <Tab
            key={id}
            className="relative flex h-24 cursor-pointer items-center justify-center rounded-lg bg-white text-sm uppercase hover:bg-gray-50 focus:ring focus:ring-offset-4 focus:outline-none"
          >
            {({ selected }) => (
              <>
                <span className="sr-only">{label}</span>
                <span className="absolute inset-0 overflow-hidden rounded-lg">
                  {image && <Image image={image} sizes={PRODUCT_THUMB_SIZES} />}
                </span>
                <span
                  className={cn(
                    selected ? 'ring-wehrli-500' : 'ring-transparent',
                    'pointer-events-none absolute inset-0 rounded-lg ring-2 ring-offset-2',
                  )}
                  aria-hidden="true"
                />
              </>
            )}
          </Tab>
        ))}
      </Tab.List>
    </div>

    <Tab.Panels>
      {images.map(({ id, image }, index) => (
        <Tab.Panel key={id}>
          {image && (
            // The first product image is the LCP element on product pages.
            <Image image={image} priority={index === 0} sizes={PRODUCT_IMAGE_SIZES} fit="fill" rounded="lg" />
          )}
        </Tab.Panel>
      ))}
    </Tab.Panels>
  </Tab.Group>
);
