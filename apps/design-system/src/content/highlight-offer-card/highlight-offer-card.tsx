import NextLink from 'next/link';
import { FC } from 'react';
import { cn } from '../../fundamentals/cn';
import { HIGHLIGHT_IMAGE_SIZES } from '../highlight-section/highlight-section';
import { Image, ImageData } from '../image/image';

type Props = {
  /**
   * `featured`: large landscape card (2 per row). `compact`: small portrait card (2 per row, 4 from lg).
   * `compactWide`: a compact card that fills a whole row (landscape) below `wideUntil`, a normal compact card from there.
   */
  variant: 'featured' | 'compact' | 'compactWide';
  /** Breakpoint from which a `compactWide` card looks like a normal compact card. Default `lg`. */
  wideUntil?: 'sm' | 'lg';
  eyebrow?: string | null;
  title: string;
  href: string;
  image?: ImageData | null;
  linkLabel?: string;
  priority?: boolean;
};

const cardLinkClass = cn(
  'ring-1 ring-black/5 transition-shadow hover:shadow-lg',
  'active:scale-[0.99] motion-reduce:active:scale-100',
  '',
);

/** An offer (service) with its text on the darkened image. The whole card is the link. */
export const HighlightOfferCard: FC<Props> = ({
  variant,
  eyebrow,
  title,
  href,
  image,
  linkLabel = 'Mehr erfahren',
  priority,
  wideUntil = 'lg',
}) => {
  const featured = variant === 'featured';

  return (
    <NextLink
      href={href}
      className={cn(
        'group relative block min-w-0 overflow-hidden rounded-md no-underline',
        featured && 'aspect-[4/3] min-h-[12.5rem] sm:aspect-[16/10] sm:min-h-[16rem] lg:min-h-[18rem]',
        variant === 'compact' && 'aspect-[3/4] min-h-[10.5rem] sm:aspect-[4/5] sm:min-h-0 lg:aspect-[4/5]',
        variant === 'compactWide' &&
          (wideUntil === 'sm'
            ? 'aspect-[16/9] min-h-[10.5rem] sm:aspect-[4/5] sm:min-h-0'
            : 'aspect-[16/9] min-h-[10.5rem] sm:aspect-[16/7] lg:aspect-[4/5] lg:min-h-0'),
        cardLinkClass,
      )}
    >
      <Image
        image={image}
        priority={priority}
        sizes={featured ? HIGHLIGHT_IMAGE_SIZES.offerFeatured : HIGHLIGHT_IMAGE_SIZES.offerCompact}
        hoverZoom
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10" aria-hidden />
      <div className="absolute inset-0 rounded-md ring-1 ring-black/10 ring-inset" aria-hidden />
      <div className={cn('absolute inset-x-0 bottom-0 text-white', featured ? 'p-4 sm:p-6 lg:p-8' : 'p-3 sm:p-4')}>
        <p className={cn('font-bold text-white/80', featured ? 'text-xxs' : 'sm:text-xxs text-xxxs leading-tight')}>
          {eyebrow}
        </p>
        <h3
          className={cn(
            'mt-1.5 font-bold text-balance break-words hyphens-auto sm:mt-2',
            featured ? 'text-lg leading-snug' : 'text-sm leading-snug sm:text-base lg:text-sm',
          )}
        >
          {title}
        </h3>
        <span
          className={cn(
            'mt-2 inline-block border-b border-white font-bold text-white sm:mt-3',
            featured ? 'text-xs sm:text-sm' : 'text-xs lg:mt-2',
          )}
        >
          {linkLabel}
        </span>
      </div>
    </NextLink>
  );
};
