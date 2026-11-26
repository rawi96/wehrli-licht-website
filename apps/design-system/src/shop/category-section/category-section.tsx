import { FC } from 'react';
import { ShopCategoryCard, ShopCategoryCardData } from '../category-card/category-card';
import { ShopSectionHeader } from '../section-header/section-header';
import { LinkData } from '../../typography/text-link/text-link';

type Props = {
  /** Anchor of the section (`#id`). */
  sectionId: string;
  headingId: string;
  title: string;
  body?: string | null;
  actionLink?: LinkData | null;
  categories: ShopCategoryCardData[];
};

/** Storefront section with all product categories as cards (4 columns from lg). Renders nothing without categories. */
export const ShopCategorySection: FC<Props> = ({ sectionId, headingId, title, body, actionLink, categories }) => {
  if (categories.length === 0) {
    return null;
  }

  return (
    <section id={sectionId} aria-labelledby={headingId} className="bg-gray-50">
      <div className="mx-auto w-11/12 max-w-7xl pt-8 pb-12 sm:pt-12 sm:pb-16 md:pt-16 md:pb-24">
        <ShopSectionHeader
          headingId={headingId}
          title={title}
          description={<p className="text-black">{body}</p>}
          action={actionLink}
        />

        <ul className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-5">
          {categories.map((category) => (
            <li key={category.id}>
              <ShopCategoryCard {...category} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
