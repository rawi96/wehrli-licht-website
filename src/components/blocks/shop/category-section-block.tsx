import { ShopCategoryCard } from '@/components/shop/shop-category-card';
import { ShopCmsTextLink } from '@/components/shop/shop-cms-text-link';
import { ShopSectionHeader } from '@/components/shop/shop-section-header';
import { ShopCategorySectionFragment } from '@/graphql/generated';
import { shopSectionHeadingId } from '@/utils/shop-page-sections';
import { ShopCategory } from '@/utils/shop';
import { FC } from 'react';

type Props = {
  block: ShopCategorySectionFragment;
  categories: ShopCategory[];
};

export const ShopCategorySectionBlock: FC<Props> = ({ block, categories }) => {
  if (categories.length === 0) {
    return null;
  }

  const sectionId = block.sectionId ?? 'shop-kategorien';
  const headingId = shopSectionHeadingId(sectionId, block.id);

  return (
    <section id={sectionId} aria-labelledby={headingId} className="bg-white-200">
      <div className="mx-auto w-11/12 max-w-7xl pt-8 pb-12 sm:pt-12 sm:pb-16 md:pt-16 md:pb-24">
        <ShopSectionHeader
          headingId={headingId}
          title={block.title}
          description={<p className="text-gray-600">{block.body}</p>}
          action={<ShopCmsTextLink link={block.actionLink} className="mt-4 md:mt-0" />}
        />

        <ul className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-5">
          {categories.map((category) => (
            <li key={category.id}>
              <ShopCategoryCard category={category} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
