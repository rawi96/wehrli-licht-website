'use client';

import { useShopContext } from '@/app/context/shop-context';
import { classNames } from '@/utils/css';
import { formatPriceToCHF } from '@/utils/price';
import { addToCart, initSwell } from '@/utils/shop';
import { Tab } from '@headlessui/react';
import Image from 'next/image';
import { useState } from 'react';
import { Product, Variant } from 'swell-js';
import { ProductVariationSelector } from './product-variation-selector';
import { RichText } from './rich-text/rich-text';
import { Button } from '../button';

type Props = {
  product: Product;
};

export const ProductDetail = ({ product }: Props) => {
  const [activeVariant, setActiveVariant] = useState<Variant | null>(null);
  const [loading, setLoading] = useState(false);

  const { setShoppingCart: setCart, setIsShowCart } = useShopContext();

  const handleAddToCartClick = async () => {
    setLoading(true);
    initSwell();

    try {
      const shoppingCart = await addToCart(product.id, activeVariant?.id);

      if ('id' in shoppingCart) {
        setCart(shoppingCart);
        setIsShowCart(true);
      } else {
        console.error(shoppingCart);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const uniqueImages = product.images?.filter((image) => image.file?.url);

  return (
    <div className="mb-20 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
      <Tab.Group as="div" className="flex flex-col-reverse">
        <div className="mx-auto mt-6 w-full max-w-2xl lg:max-w-none">
          <Tab.List className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {uniqueImages?.map((image) => (
              <Tab
                key={image.id}
                className="relative flex h-24 cursor-pointer items-center justify-center rounded bg-white text-sm uppercase hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
              >
                {({ selected }) => (
                  <>
                    <span className="sr-only">{product.name}</span>
                    <span className="absolute inset-0 overflow-hidden rounded">
                      {image.file?.url && (
                        <Image
                          src={image.file.url}
                          alt={`Bild für das Produkt ${product.name}`}
                          className="h-full w-full object-cover object-center"
                          width={1000}
                          height={1000}
                        />
                      )}
                    </span>
                    <span
                      className={classNames(
                        selected ? 'ring-wehrli-500' : 'ring-transparent',
                        'pointer-events-none absolute inset-0 rounded ring-2 ring-offset-2',
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
          {uniqueImages?.map((image) => (
            <Tab.Panel key={image.id}>
              {image.file?.url && (
                <Image
                  src={image.file.url}
                  alt={`Bild für das Produkt ${product.name}`}
                  className="rounded"
                  width={1000}
                  height={1000}
                />
              )}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>

      <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
        <h1 className="text-lg font-bold text-wehrli lg:text-xl">{product.name}</h1>

        <div className="mt-3">
          <p className="text-lg font-bold lg:text-xl">{formatPriceToCHF(activeVariant?.price ?? product.price)}</p>
        </div>

        <div className="mt-6">
          {product.variants?.results && product.variants.results.length > 0 && (
            <ProductVariationSelector product={product} setActiveVariant={setActiveVariant} />
          )}
          <div className="hidden lg:block">
            <div className="mt-3">
              <div className="sm:flex-col1 mb-10 mt-6 flex items-center">
                <div className="mr-2">
                  <Button text="Zum Warenkorb hinzufügen" type="primary" onClick={handleAddToCartClick} loading={loading} />
                </div>
                <Button text="Besichtigungstermin vereinbaren" type="secondary" href="/kontakt#termin" />
              </div>
            </div>
          </div>
          <div className="block lg:hidden">
            <div className="w-full pt-6">
              <Button
                text="Zum Warenkorb hinzufügen"
                type="primary"
                onClick={handleAddToCartClick}
                fullWidth
                loading={loading}
              />
            </div>

            <div className="pb-10 pt-6">
              <Button text="Besichtigungstermin vereinbaren" type="secondary" href="/kontakt#termin" fullWidth />
            </div>
          </div>
        </div>

        {product.description && (
          <>
            <div className="mb-2">
              <p className="text-lg font-bold">Beschreibung</p>
            </div>
            <RichText html={product.description} />
          </>
        )}
      </div>
    </div>
  );
};
