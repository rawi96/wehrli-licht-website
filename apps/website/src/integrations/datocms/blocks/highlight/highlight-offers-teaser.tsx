import { HighlightOffersTeaserFragment } from '@/graphql/generated';
import { getCmsLinkHref, toLink } from '../../links';
import { toImage } from '../../image';
import { highlightLinkedImage, highlightLinkedPortrait, highlightPortrait } from './highlight-teaser';
import { HighlightOffersTeaserBlock as HighlightOffersTeaserBlockView } from '@wehrli/design-system';
import { FC } from 'react';

type Props = {
  block: HighlightOffersTeaserFragment;
  /** Block is near the top of the page: load its lead image eagerly (LCP). */
  aboveFold?: boolean;
};

export const HighlightOffersTeaserBlock: FC<Props> = ({ block, aboveFold = false }) => (
  <HighlightOffersTeaserBlockView
    id={block.id}
    title={block.title}
    subline={block.subline}
    cta={block.footerCta && toLink(block.footerCta)}
    priority={aboveFold}
    offers={block.offers.map((offer) => ({
      id: offer.id,
      eyebrow: offer.eyebrow,
      title: offer.title,
      href: offer.offerLink && getCmsLinkHref(offer.offerLink),
      // The tile's own picture, else the teaser image of the linked page.
      image: offer.image
        ? toImage(offer.image, { fallbackAlt: offer.title })
        : highlightLinkedImage(offer.offerLink, offer.title),
      portraitImage: offer.image
        ? highlightPortrait(offer.image, offer.title)
        : highlightLinkedPortrait(offer.offerLink, offer.title),
    }))}
  />
);
