import { AllCategoriesBlockFragment } from '@/graphql/generated';
import { getAllCategories } from '@/utils/shop';
import { toShopCategoryCardData } from '@/utils/shop-cards';
import { ShopCategoryGrid } from '@wehrli/design-system';
import { FC } from 'react';

type Props = {
  block: AllCategoriesBlockFragment;
};

export const AllCategoriesBlock: FC<Props> = async ({ block: { disableMarginBottom, disableMarginTop, layout } }) => {
  const categories = await getAllCategories();

  return (
    <ShopCategoryGrid
      items={categories.map((category) => ({ ...toShopCategoryCardData(category), linkLabel: 'Kategorie entdecken' }))}
      layout={layout === 'row' ? 'row' : 'grid'}
      marginBottom={!disableMarginBottom}
      marginTop={!disableMarginTop}
    />
  );
};
