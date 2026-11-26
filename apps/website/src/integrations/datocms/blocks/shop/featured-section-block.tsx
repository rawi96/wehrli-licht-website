import { StructuredTextRenderer } from '@/integrations/datocms/blocks/structured-text';
import { toProductCardData } from '@/components/shop/cards';
import type { ProductSummary } from '@/domain/shop/product';
import { ShopFeaturedSectionFragment } from '@/graphql/generated';
import { toLink } from '@/integrations/datocms/links';
import { ShopFeaturedSection } from '@wehrli/design-system';
import { FC } from 'react';
import { toStructuredTextValue } from '../../catalog/structured-text';
import { shopSectionHeadingId } from './sections';

type Props = {
  block: ShopFeaturedSectionFragment;
  products: ProductSummary[];
};

/** Variants of one luminaire often share the same photo: show that photo once (the first variant). */
const withDistinctPhotos = (products: ProductSummary[]): ProductSummary[] => {
  const seen = new Set<string>();

  return products.filter((product) => {
    const photo = product.image?.url;

    if (!photo) {
      return true;
    }

    if (seen.has(photo)) {
      return false;
    }

    seen.add(photo);

    return true;
  });
};

export const ShopFeaturedSectionBlock: FC<Props> = ({ block, products }) => {
  const intro = toStructuredTextValue(block.intro);

  return (
    <ShopFeaturedSection
      headingId={shopSectionHeadingId('shop-featured', block.id)}
      title={block.title}
      intro={intro && <StructuredTextRenderer data={intro} />}
      actionLink={toLink(block.actionLink)}
      products={withDistinctPhotos(products).map((product) => toProductCardData(product))}
    />
  );
};
