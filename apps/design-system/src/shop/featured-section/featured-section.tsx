import { FC, ReactNode } from 'react';
import { HorizontalScroll, HorizontalScrollItem } from '../horizontal-scroll/horizontal-scroll';
import { ProductCard, ProductCardData } from '../product-card/product-card';
import { ShopSectionHeader } from '../section-header/section-header';
import { LinkData } from '../../typography/text-link/text-link';

type Props = {
  headingId: string;
  title: string;
  /** Rich text below the title, set in white. */
  intro?: ReactNode;
  actionLink?: LinkData | null;
  products: ProductCardData[];
};

/** Storefront section on the brand color: featured products in a horizontal scroll row. Renders nothing without products. */
export const ShopFeaturedSection: FC<Props> = ({ headingId, title, intro, actionLink, products }) => {
  if (products.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby={headingId} className="surface-dark bg-wehrli overflow-hidden py-10 sm:py-16 md:py-24">
      <div className="mx-auto w-11/12 max-w-7xl">
        <ShopSectionHeader
          headingId={headingId}
          title={title}
          inverted
          description={
            intro ? (
              <div className="text-sm md:text-base [&_a]:text-white [&_a:hover]:text-white/80 [&_p]:text-white/90 [&_strong]:text-white">
                {intro}
              </div>
            ) : null
          }
          action={actionLink}
        />

        <HorizontalScroll label={title} spaced mobileEdgeBleed>
          {products.map((product) => (
            <HorizontalScrollItem key={product.id}>
              <ProductCard {...product} variant="compact" />
            </HorizontalScrollItem>
          ))}
        </HorizontalScroll>
      </div>
    </section>
  );
};
