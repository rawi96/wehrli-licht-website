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
  /**
   * The first two offers are large cards, the others small cards: 2 per row on phones, from sm 3 in a row when
   * there are exactly 3, else 2 per row and 4 from lg. An odd last small card fills its row as a wide card while
   * the grid has 2 columns.
   */
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
  const threeInARow = moreOffers.length === 3;

  return (
    <HighlightSection id={id} title={title} subline={subline} cta={cta}>
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
              // Three small offers fill one row from sm; otherwise 4 per row from lg.
              threeInARow ? 'sm:grid-cols-3' : 'lg:grid-cols-4',
            )}
          >
            {moreOffers.map((offer, index) => {
              // An odd last card would sit alone in the 2-column grid: let it fill the row instead.
              const fillsRow = moreOffers.length % 2 === 1 && index === moreOffers.length - 1;

              return (
                <li
                  key={offer.id}
                  className={cn(fillsRow && (threeInARow ? 'col-span-2 sm:col-span-1' : 'col-span-2 lg:col-span-1'))}
                >
                  {offer.href && (
                    <HighlightOfferCard
                      variant={fillsRow ? 'compactWide' : 'compact'}
                      wideUntil={threeInARow ? 'sm' : 'lg'}
                      {...offer}
                      href={offer.href}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </HighlightSection>
  );
};
