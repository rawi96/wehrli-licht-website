import { FC } from 'react';
import { cn } from '../../fundamentals/cn';
import { HighlightOfferCard } from '../../content/highlight-offer-card/highlight-offer-card';
import { HighlightSection } from '../../content/highlight-section/highlight-section';
import { LinkData } from '../../typography/text-link/text-link';
import { ImageData } from '../../content/image/image';

type Offer = {
  id: string;
  eyebrow?: string | null;
  title: string;
  /** Without a link the offer is left out (its grid cell stays empty). */
  href?: string | null;
  image?: ImageData | null;
};

type Props = {
  /** Unique id of the block, for the heading id. */
  id: string;
  title: string;
  subline: string;
  cta?: LinkData | null;
  /** The first two offers are large cards, the others small cards (2 per row; from lg 3 when there are 3, else 4). */
  offers: Offer[];
  /** Loads the image of the first offer with priority (LCP). */
  priority?: boolean;
};

/** Full-width band with offers (services). Renders nothing without offers or call to action. */
export const HighlightOffersTeaserBlock: FC<Props> = ({ id, title, subline, cta, offers, priority }) => {
  if (offers.length === 0 || !cta) {
    return null;
  }

  const [featuredOffers, moreOffers] = [offers.slice(0, 2), offers.slice(2)];

  return (
    <HighlightSection id={id} title={title} subline={subline} bordered cta={cta}>
      <div className="flex flex-col gap-4 sm:gap-5">
        <ul className="grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 sm:gap-4">
          {featuredOffers.map((offer, index) => (
            <li key={offer.id}>
              {offer.href && (
                <HighlightOfferCard variant="featured" {...offer} href={offer.href} priority={priority && index === 0} />
              )}
            </li>
          ))}
        </ul>
        {moreOffers.length > 0 && (
          <ul
            className={cn(
              'grid list-none grid-cols-2 gap-2.5 p-0 min-[400px]:gap-3 sm:gap-3 lg:gap-4',
              // Three small offers fill one row; otherwise 4 per row.
              moreOffers.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4',
            )}
          >
            {moreOffers.map((offer) => (
              <li key={offer.id}>{offer.href && <HighlightOfferCard variant="compact" {...offer} href={offer.href} />}</li>
            ))}
          </ul>
        )}
      </div>
    </HighlightSection>
  );
};
