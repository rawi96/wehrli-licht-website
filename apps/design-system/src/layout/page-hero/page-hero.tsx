import { FC, ReactNode } from 'react';
import { cn } from '../../fundamentals/cn';
import { BREADCRUMBS_GAP, PAGE_HEAD_TOP } from '../page-head/page-head';
import { Image, ImageData } from '../../content/image/image';

/** Level of a content page in the page tree, see docs/adr/0002-page-levels.md. */
export type PageLevel = 'area' | 'overview' | 'detail';

/** Pages with sub-pages; detail pages use `DetailPage`. */
type HeroLevel = Exclude<PageLevel, 'detail'>;

type Props = {
  /** `area`: top-level page with sub-pages. `overview`: deeper page with sub-pages. */
  level: HeroLevel;
  /** The breadcrumb trail, rendered above the title. */
  breadcrumbs?: ReactNode;
  /** The page's H1. */
  title: string;
  intro?: string | null;
  image?: ImageData | null;
};

/** Full-width bands, pulled up under the header so they start right below it. */

const LAYOUT: Record<HeroLevel, { band: string; grid: string; title: string; intro: string; image: string; sizes: string }> =
  {
    // Area: a stage in the brand blue that continues the header, white text, the largest picture.
    area: {
      band: cn('band-wehrli surface-dark', PAGE_HEAD_TOP, 'mb-16 pb-14 lg:mb-20 lg:pb-24'),
      grid: 'lg:grid-cols-[5fr_6fr] lg:gap-14',
      title: 'text-white text-xl md:text-title leading-tight',
      intro: 'text-white/85 text-sm sm:text-base lg:text-lg leading-normal',
      image: 'aspect-[16/9] lg:aspect-[4/3]',
      sizes: '(min-width: 1400px) 700px, (min-width: 1024px) 50vw, 92vw',
    },
    // Overview: a light blue band.
    overview: {
      band: cn('band-wehrli-50', PAGE_HEAD_TOP, 'mb-12 pb-10 lg:mb-16 lg:pb-14'),
      grid: 'lg:grid-cols-[3fr_2fr] lg:gap-12',
      title: 'text-wehrli text-xl md:text-title leading-tight',
      intro: 'text-black text-sm sm:text-base leading-normal',
      image: 'aspect-[16/9] lg:aspect-[3/2]',
      sizes: '(min-width: 1400px) 500px, (min-width: 1024px) 36vw, 92vw',
    },
  };

/**
 * Head of a page with sub-pages: a band across the full width with breadcrumbs, H1 and introduction on the left and a
 * picture on the right. Areas get a dark blue stage that continues the header, overviews a light blue band, so the
 * level is clear at a glance (detail pages are white, see `DetailPage`).
 */
export const PageHero: FC<Props> = ({ level, breadcrumbs, title, intro, image }) => {
  const layout = LAYOUT[level];
  const hasImage = Boolean(image);

  return (
    <header className={layout.band}>
      {breadcrumbs ? <div className={BREADCRUMBS_GAP}>{breadcrumbs}</div> : null}
      {/* Text aligned to the top (not centred to the picture), so the title sits at the same height on every level. */}
      <div className={cn('grid grid-cols-1 items-start gap-8', hasImage && layout.grid)}>
        <div className="min-w-0">
          <h1 className={cn('font-bold text-balance break-words hyphens-auto', layout.title)}>{title}</h1>
          {intro && <p className={cn('mt-5 max-w-2xl lg:mt-6', layout.intro)}>{intro}</p>}
        </div>
        {hasImage && (
          // On phones the picture comes first, above the title, so the page does not open with a wall of text.
          <div className={cn('relative -order-1 overflow-hidden rounded-md lg:order-none', layout.image)}>
            <div className="animate-head-settle absolute inset-0 motion-reduce:animate-none">
              <Image image={image} sizes={layout.sizes} priority absolute />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
