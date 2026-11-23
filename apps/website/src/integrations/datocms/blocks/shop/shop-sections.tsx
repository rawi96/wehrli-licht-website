import type { Category } from '@/domain/shop/category';
import type { ProductSummary } from '@/domain/shop/product';
import { FC } from 'react';
import { ShopCategorySectionBlock } from './category-section-block';
import { ShopFeaturedSectionBlock } from './featured-section-block';
import { ShopHeroBlock } from './hero-block';
import { ShopPageSection } from './sections';
import { Container } from '@wehrli/design-system';
import { CardsBlock } from '../rich-blocks';

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
        case 'CardsBlockRecord':
          // The same tiles as on every page; shop sections are full width, so the tiles get the page container.
          return (
            <Container key={section.id}>
              <CardsBlock block={section} />
            </Container>
          );
        default:
          return null;
      }
    })}
  </>
);
