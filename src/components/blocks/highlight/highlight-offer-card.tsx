import { ImageComponent } from '@/components/image';
import { HighlightOfferItemFragment } from '@/graphql/generated';
import { getCmsLinkHref } from '@/utils/cms-link';
import { HIGHLIGHT_IMAGE_SIZES, getHighlightLinkedTeaserImage, highlightImageAlt } from '@/utils/highlight-teaser';
import { classNames } from '@/utils/css';
import Link from 'next/link';
import { FC } from 'react';

const OFFER_CTA_LABEL = 'Angebot ansehen';

const cardLinkClass = classNames(
  'ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-lg',
  'active:scale-[0.99] motion-reduce:active:scale-100',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wehrli focus-visible:ring-offset-2',
);

type Props = {
  offer: HighlightOfferItemFragment;
  priority?: boolean;
  featured?: boolean;
  className?: string;
};

export const HighlightOfferCard: FC<Props> = ({ offer, priority, featured, className }) => {
  if (!offer.offerLink) {
    return null;
  }

  const teaserImage = getHighlightLinkedTeaserImage(offer.offerLink);
  const imageAlt = highlightImageAlt(teaserImage?.alt, offer.title);

  return (
    <Link
      href={getCmsLinkHref(offer.offerLink)}
      className={classNames(
        'group relative block min-w-0 overflow-hidden rounded no-underline',
        featured
          ? 'aspect-[4/3] min-h-[12.5rem] sm:aspect-[16/10] sm:min-h-[16rem] lg:min-h-[18rem]'
          : 'aspect-[3/4] min-h-[10.5rem] sm:aspect-[4/5] sm:min-h-0 lg:aspect-[4/5]',
        cardLinkClass,
        className,
      )}
    >
      <ImageComponent
        image={teaserImage ? { ...teaserImage, alt: imageAlt } : null}
        priority={priority}
        sizes={featured ? HIGHLIGHT_IMAGE_SIZES.offerFeatured : HIGHLIGHT_IMAGE_SIZES.offerCompact}
        imgClassName="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-900/40 to-gray-900/10" aria-hidden />
      <div className="absolute inset-0 rounded ring-1 ring-gray-900/10 ring-inset" aria-hidden />
      <div className={classNames('absolute inset-x-0 bottom-0 text-white', featured ? 'p-4 sm:p-6 lg:p-8' : 'p-3 sm:p-4')}>
        <p
          className={classNames(
            'font-bold text-white/75 uppercase',
            featured
              ? 'text-xxs tracking-[0.18em] sm:tracking-[0.2em]'
              : 'sm:text-xxs text-[0.625rem] leading-tight tracking-[0.12em] sm:tracking-[0.16em] lg:tracking-[0.14em]',
          )}
        >
          {offer.eyebrow}
        </p>
        <h3
          className={classNames(
            'mt-1.5 font-bold text-balance break-words sm:mt-2',
            featured ? 'text-lg leading-snug sm:text-2xl' : 'text-sm leading-snug sm:text-base lg:text-sm',
          )}
        >
          {offer.title}
        </h3>
        <span
          className={classNames(
            'mt-2 inline-block border-b border-white/50 font-bold text-white/90 sm:mt-3',
            featured ? 'text-xs sm:text-sm' : 'text-xs lg:mt-2',
          )}
        >
          {OFFER_CTA_LABEL}
        </span>
      </div>
    </Link>
  );
};
