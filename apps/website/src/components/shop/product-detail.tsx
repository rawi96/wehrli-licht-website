'use client';

import { useShopContext } from '@/app/context/shop-context';
import { StructuredTextRenderer } from '@/components/dato-structured-text';
import { DEFAULT_SHIPPING_COST_CHF } from '@/constants/shop-commerce';
import { trackEvent } from '@/lib/analytics/gtag';
import { CONTACT_FORM_ANCHOR, PRODUCT_PREFILL_PARAM } from '@/lib/contact-form/schema';
import { toImage } from '@/utils/image';
import { formatShippingCostLabel } from '@/utils/product-commerce';
import { toStructuredTextValue } from '@/utils/shop-structured-text';
import { formatPriceToCHF } from '@/utils/price';
import { ShopProduct } from '@/utils/shop';
import {
  findMatchingVariant,
  pickVariantOptions,
  getProductSpecRows,
  getVariationOptions,
  ProductVariant,
  resolveSelectedOptions,
  SelectedOptions,
} from '@/utils/shop-product-detail';
import { ProductDetail as ProductDetailView, VariationSelector } from '@wehrli/design-system';
import { useEffect, useMemo, useState } from 'react';

type Props = {
  product: ShopProduct;
  /** Contact page from DatoCMS («Header & Footer»); the question link is hidden if not set. */
  contactHref: string | null;
  /** Booking of a showroom visit: the contact page's appointment section. */
  viewingHref: string;
};

const toAnalyticsItem = (product: ShopProduct, variant: ProductVariant | null) => {
  const hasSelections = variant !== null && variant.selections.length > 0;

  return {
    item_id: product.id,
    item_name: product.name,
    price: variant?.price ?? product.price ?? undefined,
    item_variant: hasSelections ? variant.selections.map((selection) => selection.value).join(' / ') : undefined,
  };
};

const productQuestionHref = (contactHref: string, product: ShopProduct) =>
  `${contactHref}?${new URLSearchParams({ [PRODUCT_PREFILL_PARAM]: product.name }).toString()}#${CONTACT_FORM_ANCHOR}`;

export const ProductDetail = ({ product, contactHref, viewingHref }: Props) => {
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
    .filter((image) => Boolean(image.responsiveImage?.src) || Boolean(image.url))
    .map((image, index, list) => ({
      id: image.url,
      image: toImage({
        ...image,
        alt: image.alt?.trim() ? image.alt : `${product.name}${list.length > 1 ? ` – Bild ${index + 1}` : ''}`,
      }),
    }));
  const displayPrice = activeVariant?.price ?? product.price;
  const shippingCost = typeof product.shippingCost === 'number' ? product.shippingCost : DEFAULT_SHIPPING_COST_CHF;
  const description = toStructuredTextValue(product.description);

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
      description={description ? <StructuredTextRenderer data={description} /> : null}
      specs={getProductSpecRows(product)}
    />
  );
};
