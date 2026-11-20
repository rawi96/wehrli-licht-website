import { ShopCategorySectionFragment } from '@/graphql/generated';
import { shopSectionHeadingId } from '@/utils/shop-page-sections';
import { ShopCategory } from '@/utils/shop';
import { toShopCategoryCardData } from '@/utils/shop-cards';
import { toShopLink } from '@/utils/shop-link';
import { ShopCategorySection } from '@wehrli/design-system';
import { FC } from 'react';

type Props = {
  block: ShopCategorySectionFragment;
  categories: ShopCategory[];
};

export const ShopCategorySectionBlock: FC<Props> = ({ block, categories }) => {
  const sectionId = block.sectionId ?? 'shop-kategorien';

  return (
    <ShopCategorySection
      sectionId={sectionId}
      headingId={shopSectionHeadingId(sectionId, block.id)}
      title={block.title}
      body={block.body}
      actionLink={toShopLink(block.actionLink)}
      categories={categories.map(toShopCategoryCardData)}
    />
  );
};
