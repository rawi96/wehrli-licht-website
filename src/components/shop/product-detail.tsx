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
import { trackEvent } from '@/lib/analytics/gtag';
import { Tab } from '@headlessui/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type ProductVariant = ShopProduct['variants'][number];

type Props = {
  product: ShopProduct;
};

/** Two columns from lg (gallery = half of the max-w-7xl content), max-w-2xl below. */
const PRODUCT_IMAGE_SIZES = '(min-width: 1400px) 620px, (min-width: 1024px) 46vw, (min-width: 768px) 672px, 92vw';
/** Thumbnails: 4 per row from sm, 2 per row below. */
const PRODUCT_THUMB_SIZES = '(min-width: 640px) 160px, 46vw';

const toAnalyticsItem = (product: ShopProduct, variant: ProductVariant | null) => {
  const hasSelections = variant !== null && variant.selections.length > 0;

  return {
    item_id: product.id,
    item_name: product.name,
    price: variant?.price ?? product.price ?? undefined,
    item_variant: hasSelections ? variant.selections.map((selection) => selection.value).join(' / ') : undefined,
  };
};

const productQuestionHref = (product: ShopProduct) =>
  `/kontakt?${new URLSearchParams({ anliegen: 'leuchte', produkt: product.name }).toString()}#kontaktformular`;

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

  useEffect(() => {
    const item = toAnalyticsItem(product, null);
    trackEvent('view_item', { currency: 'CHF', value: item.price, items: [item] });
  }, [product]);

  const handleViewingClick = () => trackEvent('besichtigung_klick', { item_name: product.name });

  const handleAddToCartClick = () => {
    setLoading(true);

    const added = addToCart(product, activeVariant);
    if (added) {
      const item = toAnalyticsItem(product, activeVariant);
      trackEvent('add_to_cart', { currency: 'CHF', value: item.price, items: [{ ...item, quantity: 1 }] });
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
                          <ImageComponent
                            image={image}
                            sizes={PRODUCT_THUMB_SIZES}
                            imgClassName="h-full w-full object-cover object-center"
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
            {images.map((image, index) => (
              <Tab.Panel key={image.url}>
                {image.responsiveImage && (
                  // The first product image is the LCP element on product pages.
                  <ImageComponent image={image} priority={index === 0} sizes={PRODUCT_IMAGE_SIZES} imgClassName="rounded" />
                )}
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
                <Button
                  text="Besichtigungstermin vereinbaren"
                  type="secondary"
                  href="/kontakt#termin"
                  onClick={handleViewingClick}
                />
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
              <Button
                text="Besichtigungstermin vereinbaren"
                type="secondary"
                href="/kontakt#termin"
                onClick={handleViewingClick}
                fullWidth
              />
            </div>
          </div>

          <p className="-mt-4 mb-10 text-sm">
            Fragen zu dieser Leuchte?{' '}
            <Link href={productQuestionHref(product)} className="text-wehrli font-bold underline">
              Schreiben Sie uns
            </Link>
          </p>
        </div>

        {product.description?.value !== undefined &&
          product.description?.value !== null &&
          !isEmptyDocument(product.description.value) && (
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
