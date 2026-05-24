import { BlockWrapper } from '@/components/block-wrapper';
import { CmsLinkButton } from '@/components/cms/cms-link-button';
import { Heading } from '@/components/nodes/heading';
import { getShopCategoryPath } from '@/constants/shop-paths';
import { HighlightShopTeaserFragment } from '@/graphql/generated';
import { getCmsLinkHref } from '@/utils/cms-link';
import { pickHighlightShopCategories } from '@/utils/highlight-teaser';
import { getAllCategories } from '@/utils/shop';
import Link from 'next/link';
import { HighlightShopCategoryTile } from './highlight-shop-category-tile';

type Props = {
  block: HighlightShopTeaserFragment;
};

export const HighlightShopTeaserBlock = async ({ block }: Props) => {
  const {
    eyebrow,
    title,
    subline,
    primaryCta,
    secondaryCta,
    popularCategoriesLabel,
    moreCategoriesLabel,
    featuredCategories,
    disableMarginTop,
    disableMarginBottom,
  } = block;

  if (!primaryCta || !secondaryCta) {
    return null;
  }

  const fallbackCategories = await getAllCategories();
  const featured = pickHighlightShopCategories(featuredCategories, fallbackCategories);

  if (featured.length === 0 && fallbackCategories.length === 0) {
    return null;
  }

  const featuredIds = new Set(featured.map((category) => category.id));
  const moreCategories = fallbackCategories.filter((category) => !featuredIds.has(category.id));
  const [primary, secondary, tertiary] = featured;
  const headingId = `highlight-teaser-${block.id}`;
  const categoriesNavLabel = moreCategoriesLabel ?? 'Weitere Kategorien';

  return (
    <BlockWrapper disableMarginTop={disableMarginTop} disableMarginBottom={disableMarginBottom} className="!my-0">
      <section aria-labelledby={headingId} className="highlight-teaser-breakout bg-wehrli text-white">
        <div className="highlight-teaser-container py-12 sm:py-16 md:py-24">
          <div className="grid gap-8 sm:gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
            <div className="lg:col-span-5">
              <p className="text-xxs font-bold tracking-[0.18em] text-white/70 uppercase sm:tracking-[0.2em]">{eyebrow}</p>
              <Heading level="2" id={headingId} color="white">
                <span className="text-balance">{title}</span>
              </Heading>
              <p className="max-w-md text-sm leading-relaxed text-pretty text-white/85 sm:text-base">{subline}</p>
              <div className="highlight-shop-ctas mt-6 sm:mt-8">
                <CmsLinkButton link={primaryCta} type="primary" white fullWidth />
                <CmsLinkButton link={secondaryCta} type="secondary" white showArrow fullWidth />
              </div>
            </div>

            {featured.length > 0 && (
              <div className="min-w-0 lg:col-span-7">
                <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                  <h3 className="text-xxs font-bold tracking-[0.14em] text-white/60 uppercase sm:tracking-wide">
                    {popularCategoriesLabel ?? 'Beliebte Kategorien'}
                  </h3>
                  <Link
                    href={getCmsLinkHref(secondaryCta)}
                    className="focus-visible:ring-offset-wehrli text-sm font-bold text-white/90 underline-offset-4 hover:text-white hover:underline focus-visible:rounded focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    {secondaryCta.label}
                  </Link>
                </div>

                <ul className="grid list-none grid-cols-2 gap-2.5 p-0 sm:gap-3 lg:hidden">
                  {primary && (
                    <li className="col-span-2">
                      <HighlightShopCategoryTile
                        category={primary}
                        className="aspect-[16/10] min-h-[11rem] sm:min-h-[12.5rem]"
                        compact
                        priority
                      />
                    </li>
                  )}
                  {secondary && (
                    <li>
                      <HighlightShopCategoryTile
                        category={secondary}
                        className="aspect-[3/4] min-h-[9.5rem] sm:min-h-[10.5rem]"
                        compact
                      />
                    </li>
                  )}
                  {tertiary && (
                    <li>
                      <HighlightShopCategoryTile
                        category={tertiary}
                        className="aspect-[3/4] min-h-[9.5rem] sm:min-h-[10.5rem]"
                        compact
                      />
                    </li>
                  )}
                </ul>

                <ul className="hidden h-[min(26rem,48vw)] list-none grid-cols-12 grid-rows-6 gap-3 p-0 lg:grid">
                  {primary && (
                    <li className="col-span-7 row-span-6">
                      <HighlightShopCategoryTile category={primary} className="size-full" priority />
                    </li>
                  )}
                  {secondary && (
                    <li className="col-span-5 row-span-3">
                      <HighlightShopCategoryTile category={secondary} className="size-full" />
                    </li>
                  )}
                  {tertiary && (
                    <li className="col-span-5 row-span-3">
                      <HighlightShopCategoryTile category={tertiary} className="size-full" />
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {moreCategories.length > 0 && (
            <nav aria-label={categoriesNavLabel} className="mt-10 border-t border-white/15 pt-8 sm:mt-12 md:mt-14">
              <h3 className="text-xxs font-bold tracking-[0.14em] text-white/60 uppercase sm:tracking-wide">
                {categoriesNavLabel}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {moreCategories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={getShopCategoryPath(category.slug)}
                      className="focus-visible:ring-offset-wehrli inline-flex min-h-10 items-center rounded-full border border-white/20 bg-white/5 px-3.5 py-2 text-sm font-bold text-white/90 transition-colors hover:border-white/40 hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:outline-none sm:px-4"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </section>
    </BlockWrapper>
  );
};
