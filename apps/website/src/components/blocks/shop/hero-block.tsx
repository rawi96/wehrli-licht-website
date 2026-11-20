import { StructuredTextRenderer } from '@/components/dato-structured-text';
import { getShopCategoryPath, SHOP_ALL_PRODUCTS_PATH } from '@/constants/shop-paths';
import { ShopStorefrontHeroFragment } from '@/graphql/generated';
import { toImage } from '@/utils/image';
import { shopSectionHeadingId } from '@/utils/shop-page-sections';
import { ShopCategory } from '@/utils/shop';
import { toLink } from '@/utils/cms-link';
import { toStructuredTextValue } from '@/utils/shop-structured-text';
import { StorefrontHero } from '@wehrli/design-system';
import { FC } from 'react';

type Props = {
  block: ShopStorefrontHeroFragment;
  fallbackCategories: ShopCategory[];
};

export const ShopHeroBlock: FC<Props> = ({ block, fallbackCategories }) => {
  const categories = block.heroCategories.length > 0 ? block.heroCategories : fallbackCategories.slice(0, 3);
  const intro = toStructuredTextValue(block.intro);

  return (
    <StorefrontHero
      headingId={shopSectionHeadingId('shop-hero', block.id)}
      eyebrow={block.eyebrow}
      title={block.title}
      intro={intro && <StructuredTextRenderer data={intro} />}
      primaryCta={toLink(block.primaryCta)}
      secondaryCta={toLink(block.secondaryCta)}
      categories={categories.map((category) => ({
        id: category.id,
        name: category.name,
        href: getShopCategoryPath(category.slug),
        image: toImage(category.image),
      }))}
      allProductsLink={{ href: SHOP_ALL_PRODUCTS_PATH, label: 'Alle Leuchten' }}
    />
  );
};
