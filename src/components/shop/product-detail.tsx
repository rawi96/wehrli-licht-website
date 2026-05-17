'use client';

import { useShopContext } from '@/app/context/shop-context';
import { Button } from '@/components/button';
import { ImageComponent } from '@/components/image';
import { ProductVariationSelector } from '@/components/shop/product-variation-selector';
import { ProductSpecs } from '@/components/shop/product-specs';
import { StructuredTextRenderer } from '@/components/dato-structured-text';
import { isEmptyDocument, StructuredText as StructuredTextType } from 'datocms-structured-text-utils';
import { ShopProduct } from '@/utils/shop';
import { classNames } from '@/utils/css';
import { DEFAULT_SHIPPING_COST_CHF } from '@/constants/shop-commerce';
import { formatPriceToCHF } from '@/utils/price';
import { Tab } from '@headlessui/react';
import { useState } from 'react';

type ProductVariant = ShopProduct['variants'][number];

type Props = {
  product: ShopProduct;
};

export const ProductDetail = ({ product }: Props) => {
  const [activeVariant, setActiveVariant] = useState<ProductVariant | null>(null);
  const [loading, setLoading] = useState(false);
  const { addToCart, setIsShowCart } = useShopContext();

  const images = product.images
    .filter((image) => Boolean(image.responsiveImage?.src) || Boolean(image.url))
    .map((image, index, list) => ({
      ...image,
      alt: image.alt?.trim() ?? `${product.name}${list.length > 1 ? ` – Bild ${index + 1}` : ''}`,
    }));
  const displayPrice = activeVariant?.price ?? product.price;

  const handleAddToCartClick = () => {
    setLoading(true);

    const added = addToCart(product, activeVariant);
    if (added) {
      setIsShowCart(true);
    } else {
      console.error('Produkt konnte nicht in den Warenkorb gelegt werden.');
    }

    setLoading(false);
  };

  return (
    <div className="mb-20 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
      {images.length > 0 && (
        <Tab.Group as="div" className="flex flex-col-reverse">
          <div className="mx-auto mt-6 w-full max-w-2xl lg:max-w-none">
            <Tab.List className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {images.map((image) => (
                <Tab
                  key={image.url}
                  className="focus:ring-opacity-50 relative flex h-24 cursor-pointer items-center justify-center rounded bg-white text-sm uppercase hover:bg-gray-50 focus:ring focus:ring-offset-4 focus:outline-none"
                >
                  {({ selected }) => (
                    <>
                      <span className="sr-only">{product.name}</span>
                      <span className="absolute inset-0 overflow-hidden rounded">
                        {image.responsiveImage && (
                          <ImageComponent image={image} imgClassName="h-full w-full object-cover object-center" />
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
            {images.map((image) => (
              <Tab.Panel key={image.url}>
                {image.responsiveImage && <ImageComponent image={image} imgClassName="rounded" />}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      )}

      <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
        <h1 className="text-wehrli text-lg font-bold lg:text-xl">{product.name}</h1>

        <div className="mt-3">
          <p className="text-lg font-bold lg:text-xl">{formatPriceToCHF(displayPrice ?? undefined)}</p>
          {product.deliveryTime && <p className="mt-2 text-sm text-gray-600">Lieferzeit: {product.deliveryTime}</p>}
          <p className="mt-1 text-sm text-gray-600">
            Versandkosten:{' '}
            {(typeof product.shippingCost === 'number' ? product.shippingCost : DEFAULT_SHIPPING_COST_CHF) > 0
              ? formatPriceToCHF(typeof product.shippingCost === 'number' ? product.shippingCost : DEFAULT_SHIPPING_COST_CHF)
              : 'Gratis'}
          </p>
        </div>

        <div className="mt-6">
          {product.variants.length > 0 && <ProductVariationSelector product={product} setActiveVariant={setActiveVariant} />}

          <div className="hidden lg:block">
            <div className="mt-3">
              <div className="sm:flex-col1 mt-6 mb-10 flex items-center">
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

            <div className="pt-6 pb-10">
              <Button text="Besichtigungstermin vereinbaren" type="secondary" href="/kontakt#termin" fullWidth />
            </div>
          </div>
        </div>

        {product.description?.value !== undefined &&
          product.description?.value !== null &&
          !isEmptyDocument(product.description.value as StructuredTextType) && (
            <>
              <div className="mt-8 mb-2">
                <p className="text-lg font-bold">Beschreibung</p>
              </div>
              <StructuredTextRenderer data={product.description.value as StructuredTextType} />
            </>
          )}

        <ProductSpecs product={product} />
      </div>
    </div>
  );
};
