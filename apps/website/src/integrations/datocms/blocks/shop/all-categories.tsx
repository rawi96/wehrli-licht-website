import { toShopCategoryCardData } from '@/components/shop/cards';
import { AllCategoriesBlockFragment } from '@/graphql/generated';
import { ShopCategoryGrid } from '@wehrli/design-system';
import { FC } from 'react';
import { getAllCategories } from '../../catalog/queries';
import { toCategory } from '../../catalog/mapping';
import { getSiteTexts } from '../../site-texts';

type Props = {
  block: AllCategoriesBlockFragment;
};

/** Content block «Alle Kategorien»: the shop's categories as tiles. */
export const AllCategoriesBlock: FC<Props> = async ({ block: { disableMarginBottom, disableMarginTop, layout } }) => {
  const [categories, { categoryCardLink }] = await Promise.all([
    getAllCategories().then((all) => all.map(toCategory)),
    getSiteTexts(),
  ]);

  return (
    <ShopCategoryGrid
      items={categories.map((category) => ({ ...toShopCategoryCardData(category), linkLabel: categoryCardLink }))}
      layout={layout === 'row' ? 'row' : 'grid'}
      marginBottom={!disableMarginBottom}
      marginTop={!disableMarginTop}
    />
  );
};
