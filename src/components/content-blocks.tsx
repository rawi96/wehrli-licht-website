import { PageQuery } from '@/graphql/generated';
import { FC } from 'react';
import { CalendlyBlock } from './blocks/calendly';
import { ContactBlock } from './blocks/contact';
import { GalleryBlock } from './blocks/gallery';
import { HighlightOffersTeaserBlock } from './blocks/highlight/highlight-offers-teaser';
import { HighlightProjectsTeaserBlock } from './blocks/highlight/highlight-projects-teaser';
import { HighlightShopTeaserBlock } from './blocks/highlight/highlight-shop-teaser';
import { IframeBlock } from './blocks/iframe';
import { ImageBlock } from './blocks/image';
import { LogoGridBlock } from './blocks/logo-grid';
import { QuoteBlock } from './blocks/quote';
import { AllCategoriesBlock } from './blocks/shop/all-categories';
import { TeamBlock } from './blocks/team';
import { TeaserGridBlock } from './blocks/teaser-grid';
import { TeaserRowBlock } from './blocks/teaser-row';
import { TextBlock } from './blocks/text';
import { TextImageBlock } from './blocks/text-image';
import { TextThreeColBlock } from './blocks/text-three-col';
import { TextTwoColBlock } from './blocks/text-two-col';

export type ContentBlock = NonNullable<PageQuery['page']>['content'][number];

type Props = {
  blocks: ContentBlock[];
};

export const ContentBlocks: FC<Props> = ({ blocks }) => (
  <>
    {blocks.map((block) => {
      switch (block.__typename) {
        case 'TextRecord':
          return <TextBlock key={block.id} block={block} />;
        case 'TextTwoColumnRecord':
          return <TextTwoColBlock key={block.id} block={block} />;
        case 'TextThreeColumnRecord':
          return <TextThreeColBlock key={block.id} block={block} />;
        case 'TextImageRecord':
          return <TextImageBlock key={block.id} block={block} />;
        case 'ImageRecord':
          return <ImageBlock key={block.id} block={block} />;
        case 'TeamRecord':
          return <TeamBlock key={block.id} block={block} />;
        case 'IframeRecord':
          return <IframeBlock key={block.id} block={block} />;
        case 'QuoteRecord':
          return <QuoteBlock key={block.id} block={block} />;
        case 'GalleryRecord':
          return <GalleryBlock key={block.id} block={block} />;
        case 'LogoGridRecord':
          return <LogoGridBlock key={block.id} block={block} />;
        case 'TeaserGridRecord':
          return <TeaserGridBlock key={block.id} block={block} />;
        case 'TeaserRowRecord':
          return <TeaserRowBlock key={block.id} block={block} />;
        case 'AllCategoriesBlockRecord':
          return <AllCategoriesBlock key={block.id} block={block} />;
        case 'ContactRecord':
          return <ContactBlock key={block.id} block={block} />;
        case 'CalendlyRecord':
          return <CalendlyBlock key={block.id} block={block} />;
        case 'HighlightProjectsTeaserRecord':
          return <HighlightProjectsTeaserBlock key={block.id} block={block} />;
        case 'HighlightOffersTeaserRecord':
          return <HighlightOffersTeaserBlock key={block.id} block={block} />;
        case 'HighlightShopTeaserRecord':
          return <HighlightShopTeaserBlock key={block.id} block={block} />;
        default:
          return null;
      }
    })}
  </>
);
