import { AllCategoriesGrid, shopCategoryToGridItem } from '@/components/shop/all-categories-grid';
import { AllCategoriesBlockFragment } from '@/graphql/generated';
import { getAllCategories } from '@/utils/shop';
import { FC } from 'react';

type Props = {
  block: AllCategoriesBlockFragment;
};

export const AllCategoriesBlock: FC<Props> = async ({ block: { disableMarginBottom, disableMarginTop, layout } }) => {
  const categories = await getAllCategories();

  return (
    <AllCategoriesGrid
      items={categories.map((category) => shopCategoryToGridItem(category))}
      layout={layout === 'row' ? 'row' : 'grid'}
      disableMarginBottom={disableMarginBottom}
      disableMarginTop={disableMarginTop}
    />
  );
};
