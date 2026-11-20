import type { Category } from '@/domain/shop/category';
import type { ProductSummary } from '@/domain/shop/product';
import { FC } from 'react';
import { ShopCategorySectionBlock } from './category-section-block';
import { ShopFeaturedSectionBlock } from './featured-section-block';
import { ShopHeroBlock } from './hero-block';
import { ShopPageSection } from './sections';
import { ShopServiceSectionBlock } from './service-section-block';

type Props = {
  sections: ShopPageSection[];
  categories: Category[];
  featuredProducts: ProductSummary[];
};

/** The sections of the shop's start page («Shop» in DatoCMS). */
export const ShopSections: FC<Props> = ({ sections, categories, featuredProducts }) => (
  <>
    {sections.map((section) => {
      switch (section.__typename) {
        case 'ShopStorefrontHeroRecord':
          return <ShopHeroBlock key={section.id} block={section} fallbackCategories={categories} />;
        case 'ShopCategorySectionRecord':
          return <ShopCategorySectionBlock key={section.id} block={section} categories={categories} />;
        case 'ShopSfFeaturedRecord':
          return <ShopFeaturedSectionBlock key={section.id} block={section} products={featuredProducts} />;
        case 'ShopServiceSectionRecord':
          return <ShopServiceSectionBlock key={section.id} block={section} />;
        default:
          return null;
      }
    })}
  </>
);
