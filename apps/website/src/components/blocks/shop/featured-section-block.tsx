import { StructuredTextRenderer } from '@/integrations/datocms/blocks/structured-text';
import { ShopFeaturedSectionFragment } from '@/graphql/generated';
import { shopSectionHeadingId } from '@/utils/shop-page-sections';
import { ShopProductListItem } from '@/utils/shop';
import { toProductCardData } from '@/utils/shop-cards';
import { toLink } from '@/integrations/datocms/links';
import { toStructuredTextValue } from '@/utils/shop-structured-text';
import { ShopFeaturedSection } from '@wehrli/design-system';
import { FC } from 'react';

type Props = {
  block: ShopFeaturedSectionFragment;
  products: ShopProductListItem[];
};

export const ShopFeaturedSectionBlock: FC<Props> = ({ block, products }) => {
  const intro = toStructuredTextValue(block.intro);

  return (
    <ShopFeaturedSection
      headingId={shopSectionHeadingId('shop-featured', block.id)}
      title={block.title}
      intro={intro && <StructuredTextRenderer data={intro} />}
      actionLink={toLink(block.actionLink)}
      products={products.map((product) => toProductCardData(product))}
    />
  );
};
