import NextLink from 'next/link';
import { FC } from 'react';
import { Button } from '../../actions/button/button';
import { HighlightCategoryTile } from '../../content/highlight-category-tile/highlight-category-tile';
import { HighlightBreakout, HighlightLink } from '../../content/highlight-section/highlight-section';
import { ImageData } from '../../content/image/image';
import { Heading } from '../../typography/heading/heading';

type Category = {
  id: string;
  name: string;
  href: string;
};

type Props = {
  /** Unique id of the block, for the heading id. */
  id: string;
  eyebrow?: string | null;
  title: string;
  subline?: string | null;
  primaryCta: HighlightLink;
  /** Text button below the primary one; also linked beside the featured categories. */
  secondaryCta: HighlightLink;
  /** Up to three categories as image tiles: one large, two small. */
  featuredCategories: (Category & { image?: ImageData | null })[];
  /** Further categories as pills below. */
  moreCategories: Category[];
  popularCategoriesLabel?: string | null;
  moreCategoriesLabel?: string | null;
  /** Small label on each category tile. */
  categoryLabel?: string;
  /** Loads the image of the large tile with priority (LCP). */
  priority?: boolean;
};

/** Full-width brand-colored band that leads into the shop: text with calls to action and category tiles. */
export const HighlightShopTeaserBlock: FC<Props> = ({
  id,
  eyebrow,
  title,
  subline,
  primaryCta,
  secondaryCta,
  featuredCategories,
  moreCategories,
  popularCategoriesLabel,
  moreCategoriesLabel,
  categoryLabel,
  priority,
}) => {
  const [primary, secondary, tertiary] = featuredCategories;
  const headingId = `highlight-teaser-${id}`;
  const categoriesNavLabel = moreCategoriesLabel ?? 'Weitere Kategorien';

  return (
    <HighlightBreakout headingId={headingId} surface="brand">
      <div className="grid gap-8 sm:gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
        <div className="lg:col-span-5">
          <p className="text-xxs tracking-eyebrow sm:tracking-eyebrow-wide font-bold text-white/70 uppercase">{eyebrow}</p>
          <Heading level="2" id={headingId} color="white">
            <span className="text-balance">{title}</span>
          </Heading>
          <p className="max-w-md text-sm leading-relaxed text-pretty text-white/85 sm:text-base">{subline}</p>
          <div className="mt-6 flex w-full max-w-[22rem] flex-col gap-3 *:w-full sm:mt-8 lg:max-w-none lg:flex-row lg:flex-nowrap lg:items-center lg:gap-4 lg:*:w-auto">
            <Button variant="primary-white" href={primaryCta.href} showArrow={false} fullWidth newTab={!!primaryCta.newTab}>
              {primaryCta.label}
            </Button>
            <Button variant="secondary-white" href={secondaryCta.href} showArrow fullWidth newTab={!!secondaryCta.newTab}>
              {secondaryCta.label}
            </Button>
          </div>
        </div>

        {featuredCategories.length > 0 && (
          <div className="min-w-0 lg:col-span-7">
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
              <h3 className="text-xxs tracking-label font-bold text-white/60 uppercase sm:tracking-wide">
                {popularCategoriesLabel ?? 'Beliebte Kategorien'}
              </h3>
              <NextLink
                href={secondaryCta.href}
                className="focus-visible:ring-offset-wehrli text-sm font-bold text-white/90 underline-offset-4 hover:text-white hover:underline focus-visible:rounded-lg focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                {secondaryCta.label}
              </NextLink>
            </div>

            {/* One tile per category, laid out per breakpoint (no hidden duplicates). */}
            <ul className="grid list-none grid-cols-2 gap-2.5 p-0 sm:gap-3 lg:h-[min(26rem,48vw)] lg:grid-cols-12 lg:grid-rows-6">
              {primary && (
                <li className="col-span-2 lg:col-span-7 lg:row-span-6">
                  <HighlightCategoryTile {...primary} label={categoryLabel} size="large" priority={priority} />
                </li>
              )}
              {secondary && (
                <li className="lg:col-span-5 lg:row-span-3">
                  <HighlightCategoryTile {...secondary} label={categoryLabel} size="small" />
                </li>
              )}
              {tertiary && (
                <li className="lg:col-span-5 lg:row-span-3">
                  <HighlightCategoryTile {...tertiary} label={categoryLabel} size="small" />
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {moreCategories.length > 0 && (
        <nav aria-label={categoriesNavLabel} className="mt-10 border-t border-white/15 pt-8 sm:mt-12 md:mt-14">
          <h3 className="text-xxs tracking-label font-bold text-white/60 uppercase sm:tracking-wide">
            {categoriesNavLabel}
          </h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {moreCategories.map((category) => (
              <li key={category.id}>
                <NextLink
                  href={category.href}
                  className="focus-visible:ring-offset-wehrli inline-flex min-h-10 items-center rounded-full border border-white/20 bg-white/5 px-3.5 py-2 text-sm font-bold text-white/90 transition-colors hover:border-white/40 hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:outline-none sm:px-4"
                >
                  {category.name}
                </NextLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </HighlightBreakout>
  );
};
