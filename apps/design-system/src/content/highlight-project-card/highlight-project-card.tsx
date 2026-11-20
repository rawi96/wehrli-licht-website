import NextLink from 'next/link';
import { FC } from 'react';
import { cn } from '../../fundamentals/cn';
import { HIGHLIGHT_IMAGE_SIZES } from '../highlight-section/highlight-section';
import { Image, ImageData } from '../image/image';

type Props = {
  /** `featured`: wide card with the image beside the text from lg. `compact`: card for a grid of 2–3 columns. */
  variant: 'featured' | 'compact';
  /** What was done (offer), shown as eyebrow. */
  offer?: string | null;
  title: string;
  company?: string | null;
  description?: string | null;
  href: string;
  image?: ImageData | null;
  linkLabel?: string;
  priority?: boolean;
};

const cardLinkClass = cn(
  'shadow-sm ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-md',
  'active:scale-[0.99] motion-reduce:active:scale-100',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wehrli focus-visible:ring-offset-2',
);

/** A reference project: image, offer, title, company and description. The whole card is the link. */
export const HighlightProjectCard: FC<Props> = ({
  variant,
  offer,
  title,
  company,
  description,
  href,
  image,
  linkLabel = 'Projekt ansehen',
  priority,
}) => {
  const compact = variant === 'compact';

  const content = (
    <>
      <p className="text-wehrli-400 text-xxs tracking-eyebrow sm:tracking-eyebrow-wider font-bold uppercase">{offer}</p>
      <h3
        className={cn(
          'text-wehrli mt-2 leading-snug font-bold text-balance',
          compact ? 'text-base sm:text-lg' : 'mt-2.5 text-lg sm:mt-3 sm:text-xl',
        )}
      >
        {title}
      </h3>
      <p className="mt-1.5 text-sm font-bold text-black/70 sm:mt-2">{company}</p>
      <p className={cn('mt-2.5 text-sm leading-relaxed text-pretty text-gray-700 sm:mt-3', compact ? 'flex-1' : 'max-w-sm')}>
        {description}
      </p>
      <span
        className={cn(
          'text-wehrli/80 group-hover:text-wehrli mt-4 inline-block text-sm font-bold transition-colors group-hover:underline group-hover:underline-offset-4 sm:mt-5',
        )}
      >
        {linkLabel}
      </span>
    </>
  );

  return compact ? (
    <NextLink
      href={href}
      className={cn('group bg-white-100 flex h-full flex-col overflow-hidden rounded-lg no-underline', cardLinkClass)}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image image={image} sizes={HIGHLIGHT_IMAGE_SIZES.projectCompact} priority={priority} hoverZoom="slow-subtle" />
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">{content}</div>
    </NextLink>
  ) : (
    <NextLink
      href={href}
      className={cn(
        'group bg-white-100 grid w-full grid-cols-1 overflow-hidden rounded-lg no-underline',
        cardLinkClass,
        'lg:min-h-[18rem] lg:grid-cols-12',
      )}
    >
      <div className="relative aspect-[16/11] min-h-[11rem] overflow-hidden sm:min-h-[13rem] lg:col-span-7 lg:aspect-auto lg:min-h-full">
        <Image image={image} sizes={HIGHLIGHT_IMAGE_SIZES.projectFeatured} priority={priority} hoverZoom="slow-subtle" />
      </div>
      <div className="flex flex-col justify-center p-5 sm:p-6 lg:col-span-5 lg:p-8">{content}</div>
    </NextLink>
  );
};
