'use client';

import { toImageData } from '@/components/shop/catalog-image';
import { useShopContext } from '@/components/shop/shop-context';
import { formatShippingCostLabel, getProductShippingCostChf } from '@/domain/shop/commerce';
import { formatPriceToCHF } from '@/domain/shop/price';
import type { Product, ProductVariant } from '@/domain/shop/product';
import {
  findMatchingVariant,
  pickVariantOptions,
  getProductSpecRows,
  getVariationOptions,
  resolveSelectedOptions,
  SelectedOptions,
} from '@/domain/shop/variants';
import { trackEvent } from '@/lib/analytics/gtag';
import { CONTACT_FORM_ANCHOR, PRODUCT_PREFILL_PARAM } from '@/lib/contact-form/schema';
import { ProductDetail as ProductDetailView, VariationSelector } from '@wehrli/design-system';
import { ReactNode, useEffect, useMemo, useState } from 'react';

type Props = {
  product: Product;
  /** The product's description, rendered rich text (from the catalog). */
  description: ReactNode;
  /** Contact page from DatoCMS («Header & Footer»); the question link is hidden if not set. */
  contactHref: string | null;
  /** Booking of a showroom visit: the contact page's appointment section. */
  viewingHref: string;
};

const toAnalyticsItem = (product: Product, variant: ProductVariant | null) => {
  const hasSelections = variant !== null && variant.selections.length > 0;

  return {
    item_id: product.id,
    item_name: product.name,
    price: variant?.price ?? product.price ?? undefined,
    item_variant: hasSelections ? variant.selections.map((selection) => selection.value).join(' / ') : undefined,
  };
};

const productQuestionHref = (contactHref: string, product: Product) =>
  `${contactHref}?${new URLSearchParams({ [PRODUCT_PREFILL_PARAM]: product.name }).toString()}#${CONTACT_FORM_ANCHOR}`;

export const ProductDetail = ({ product, description, contactHref, viewingHref }: Props) => {
  const [pickedOptions, setPickedOptions] = useState<SelectedOptions>({});
  const { addToCart, setIsShowCart } = useShopContext();

  const variationOptions = useMemo(() => getVariationOptions(product.variants), [product.variants]);
  const selectedOptions = useMemo(
    () => resolveSelectedOptions(variationOptions, pickedOptions),
    [variationOptions, pickedOptions],
  );
  const activeVariant = useMemo(
    () => (product.variants.length > 0 ? findMatchingVariant(product.variants, selectedOptions) : null),
    [product.variants, selectedOptions],
  );

  const images = product.images
    .filter((image) => Boolean(image.responsive?.src) || Boolean(image.url))
    .map((image, index, list) => ({
      id: image.url,
      image: toImageData({
        ...image,
        alt: image.alt?.trim() ? image.alt : `${product.name}${list.length > 1 ? ` – Bild ${index + 1}` : ''}`,
      }),
    }));
  const displayPrice = activeVariant?.price ?? product.price;
  const shippingCost = getProductShippingCostChf(product);

  useEffect(() => {
    const item = toAnalyticsItem(product, null);
    trackEvent('view_item', { currency: 'CHF', value: item.price, items: [item] });
  }, [product]);

  const handleViewingClick = () => trackEvent('besichtigung_klick', { item_name: product.name });

  const handleAddToCartClick = () => {
    const added = addToCart(product, activeVariant);
    if (added) {
      const item = toAnalyticsItem(product, activeVariant);
      trackEvent('add_to_cart', { currency: 'CHF', value: item.price, items: [{ ...item, quantity: 1 }] });
      setIsShowCart(true);
    } else {
      console.error('Produkt konnte nicht in den Warenkorb gelegt werden.');
    }
  };

  return (
    <ProductDetailView
      name={product.name}
      images={images}
      price={formatPriceToCHF(displayPrice ?? undefined)}
      deliveryTime={product.deliveryTime}
      shippingCost={formatShippingCostLabel('post', shippingCost)}
      variations={
        product.variants.length > 0 ? (
          <VariationSelector
            options={variationOptions}
            selected={selectedOptions}
            onSelect={(option, value) =>
              setPickedOptions(pickVariantOptions(product.variants, selectedOptions, option, value))
            }
          />
        ) : null
      }
      onAddToCart={handleAddToCartClick}
      viewingHref={viewingHref}
      onViewingClick={handleViewingClick}
      questionHref={contactHref ? productQuestionHref(contactHref, product) : null}
      description={description}
      specs={getProductSpecRows(product)}
    />
  );
};
