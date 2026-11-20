import { ShopHorizontalScroll, ShopHorizontalScrollItem } from '@/components/shop/shop-horizontal-scroll';
import { ShopProductCard } from '@/components/shop/shop-product-card';
import { ShopCmsTextLink } from '@/components/shop/shop-cms-text-link';
import { ShopSectionHeader } from '@/components/shop/shop-section-header';
import { ShopStructuredText } from '@/components/shop/shop-structured-text';
import { ShopFeaturedSectionFragment } from '@/graphql/generated';
import { shopSectionHeadingId } from '@/utils/shop-page-sections';
import { toStructuredTextValue } from '@/utils/shop-structured-text';
import { ShopProductListItem } from '@/utils/shop';
import { FC } from 'react';

type Props = {
  block: ShopFeaturedSectionFragment;
  products: ShopProductListItem[];
};

export const ShopFeaturedSectionBlock: FC<Props> = ({ block, products }) => {
  if (products.length === 0) {
    return null;
  }

  const headingId = shopSectionHeadingId('shop-featured', block.id);
  const intro = toStructuredTextValue(block.intro);

  return (
    <section
      aria-labelledby={headingId}
      className="bg-wehrli border-wehrli-400 overflow-hidden border-t py-10 sm:py-16 md:py-24"
    >
      <div className="mx-auto w-11/12 max-w-7xl">
        <ShopSectionHeader
          headingId={headingId}
          title={block.title}
          headingColor="white"
          description={<ShopStructuredText data={intro} inverted className="text-sm md:text-base" />}
          action={<ShopCmsTextLink link={block.actionLink} inverted className="mt-4 md:mt-0" />}
        />

        <ShopHorizontalScroll ariaLabel={block.title} className="mt-8 sm:mt-10" mobileEdgeBleed>
          {products.map((product) => (
            <ShopHorizontalScrollItem key={product.id}>
              <ShopProductCard product={product} compact />
            </ShopHorizontalScrollItem>
          ))}
        </ShopHorizontalScroll>
      </div>
    </section>
  );
};
