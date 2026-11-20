import { toShopCategoryCardData } from '@/components/shop/cards';
import type { Category } from '@/domain/shop/category';
import { ShopCategorySectionFragment } from '@/graphql/generated';
import { toLink } from '@/utils/cms-link';
import { ShopCategorySection } from '@wehrli/design-system';
import { FC } from 'react';
import { shopSectionHeadingId } from './sections';

type Props = {
  block: ShopCategorySectionFragment;
  categories: Category[];
};

export const ShopCategorySectionBlock: FC<Props> = ({ block, categories }) => {
  const sectionId = block.sectionId ?? 'shop-kategorien';

  return (
    <ShopCategorySection
      sectionId={sectionId}
      headingId={shopSectionHeadingId(sectionId, block.id)}
      title={block.title}
      body={block.body}
      actionLink={toLink(block.actionLink)}
      categories={categories.map(toShopCategoryCardData)}
    />
  );
};
