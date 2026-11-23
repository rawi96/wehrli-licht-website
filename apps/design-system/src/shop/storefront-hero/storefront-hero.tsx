import Link from 'next/link';
import { FC, ReactNode } from 'react';
import { LinkButton } from '../../actions/button/button';
import { Image, ImageData } from '../../content/image/image';
import { cn } from '../../fundamentals/cn';
import { Heading } from '../../typography/heading/heading';
import { LinkData } from '../../typography/text-link/text-link';
import { ShopTextLink } from '../text-link/text-link';

export type StorefrontHeroCategory = {
  id: string;
  name: string;
  href: string;
  image?: ImageData | null;
};

type Props = {
  headingId: string;
  eyebrow?: string | null;
  title: string;
  /** Rich text below the title. */
  intro?: ReactNode;
  primaryCta?: LinkData | null;
  secondaryCta?: LinkData | null;
  /** Up to three categories as image tiles; the first one is large and the LCP image. */
  categories: StorefrontHeroCategory[];
  /** Link above the tiles. */
  allProductsLink: LinkData;
  labels?: {
    /** Above the tiles. */
    topCategories: string;
    /** Small text on each tile and in its accessible name. */
    categoryTile: string;
  };
};

const DEFAULT_LABELS = { topCategories: 'Top-Kategorien', categoryTile: 'Leuchten-Kategorie' };

const TILE_STYLES = {
  primary: {
    className: 'col-span-2 aspect-[5/3] min-h-[10.5rem] sm:min-h-52 lg:col-span-7 lg:row-span-6 lg:aspect-auto lg:min-h-0',
    sizes: '(min-width: 1024px) 440px, 92vw',
  },
  secondary: {
    className: 'aspect-[4/5] min-h-36 sm:min-h-40 lg:col-span-5 lg:row-span-3 lg:aspect-auto lg:min-h-0',
    sizes: '(min-width: 1024px) 320px, 46vw',
  },
} as const;

const CategoryTile: FC<{
  category: StorefrontHeroCategory;
  size: keyof typeof TILE_STYLES;
  priority?: boolean;
  label: string;
}> = ({ category, size, priority, label }) => (
  <Link
    href={category.href}
    aria-label={`${category.name} – ${label}`}
    className={cn(
      'group relative block min-h-0 overflow-hidden rounded-md bg-gray-100 shadow-sm',
      TILE_STYLES[size].className,
    )}
  >
    <div className="absolute inset-0">
      {category.image ? (
        <Image image={category.image} priority={priority} sizes={TILE_STYLES[size].sizes} hoverZoom />
      ) : (
        <div className="bg-wehrli/10 flex size-full items-center justify-center">
          <span className="text-wehrli px-4 text-center text-sm font-bold">{category.name}</span>
        </div>
      )}
    </div>
    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" aria-hidden="true" />
    {/* Compact below lg, large tile layout from lg. */}
    <div className="absolute inset-x-0 bottom-0 p-3 lg:p-4">
      <p className="text-xs font-bold text-white/80 lg:text-xs">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-white sm:text-base lg:text-lg">{category.name}</p>
    </div>
  </Link>
);

/** Top of the shop's start page: eyebrow, title, intro and buttons, beside up to three category tiles. */
export const StorefrontHero: FC<Props> = ({
  headingId,
  eyebrow,
  title,
  intro,
  primaryCta,
  secondaryCta,
  categories,
  allProductsLink,
  labels = DEFAULT_LABELS,
}) => {
  const [primary, secondary, tertiary] = categories;

  return (
    <section aria-labelledby={headingId} className="border-b border-gray-200 bg-white">
      <div className="mx-auto grid w-11/12 max-w-7xl gap-8 py-8 sm:gap-10 sm:py-12 md:gap-12 md:py-16 lg:grid-cols-12 lg:items-center lg:gap-16 lg:py-20">
        <div className="lg:col-span-5 [&_h1]:mb-4 sm:[&_h1]:mb-6 lg:[&_h1]:mb-8">
          <p className="text-wehrli text-xs font-bold sm:text-sm">{eyebrow}</p>
          <Heading level="1" id={headingId}>
            {title}
          </Heading>
          {intro ? <div className="text-sm leading-relaxed text-black lg:text-base">{intro}</div> : null}

          <div className="mt-6 hidden flex-wrap gap-3 lg:mt-8 lg:flex">
            {primaryCta && <LinkButton link={primaryCta} variant="primary" />}
            {secondaryCta && <LinkButton link={secondaryCta} variant="secondary" />}
          </div>
        </div>

        {categories.length > 0 && (
          <div className="lg:col-span-7">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-xs font-bold text-gray-600">{labels.topCategories}</p>
              <ShopTextLink {...allProductsLink} />
            </div>

            {/* One tile per category, laid out per breakpoint (no hidden duplicates): the LCP tile is
                priority on every device and nothing is downloaded twice. */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:h-[min(28rem,52vw)] lg:grid-cols-12 lg:grid-rows-6">
              {primary && <CategoryTile category={primary} size="primary" priority label={labels.categoryTile} />}
              {secondary && <CategoryTile category={secondary} size="secondary" label={labels.categoryTile} />}
              {tertiary && <CategoryTile category={tertiary} size="secondary" label={labels.categoryTile} />}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 lg:hidden">
          {primaryCta && <LinkButton link={primaryCta} variant="primary" fullWidth />}
          {secondaryCta && <LinkButton link={secondaryCta} variant="secondary" fullWidth />}
        </div>
      </div>
    </section>
  );
};
