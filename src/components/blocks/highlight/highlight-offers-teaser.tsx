import { CmsLinkButton } from '@/components/cms/cms-link-button';
import { HighlightOffersTeaserFragment } from '@/graphql/generated';
import { FC } from 'react';
import { HighlightOfferCard } from './highlight-offer-card';
import { HighlightTeaserSection } from './highlight-teaser-section';

type Props = {
  block: HighlightOffersTeaserFragment;
};

export const HighlightOffersTeaserBlock: FC<Props> = ({ block }) => {
  const { title, subline, footerCta, offers, disableMarginTop, disableMarginBottom } = block;

  if (offers.length === 0 || !footerCta) {
    return null;
  }

  const [featuredOffers, moreOffers] = [offers.slice(0, 2), offers.slice(2)];

  return (
    <HighlightTeaserSection
      blockId={block.id}
      title={title}
      subline={subline}
      bordered
      disableMarginTop={disableMarginTop}
      disableMarginBottom={disableMarginBottom}
      footer={<CmsLinkButton link={footerCta} type="primary" fullWidth />}
    >
      <div className="flex flex-col gap-4 sm:gap-5">
        <ul className="grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 sm:gap-4">
          {featuredOffers.map((offer, index) => (
            <li key={offer.id}>
              <HighlightOfferCard offer={offer} featured priority={index === 0} />
            </li>
          ))}
        </ul>
        {moreOffers.length > 0 && (
          <ul className="grid list-none grid-cols-2 gap-2.5 p-0 min-[400px]:gap-3 sm:gap-3 lg:grid-cols-4 lg:gap-4">
            {moreOffers.map((offer) => (
              <li key={offer.id}>
                <HighlightOfferCard offer={offer} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </HighlightTeaserSection>
  );
};
