import { PageQuery } from '@/graphql/generated';
import { FC } from 'react';
import { CalendlyBlock } from './calendly';
import { ContactBlock } from './contact';
import { ContactFormBlock } from './contact-form';
import { FaqBlock } from './faq';
import { ProjectsBlock, ProjectsOverviewBlock } from './projects';
import { GalleryBlock } from './gallery';
import { HighlightOffersTeaserBlock } from './highlight/highlight-offers-teaser';
import { HighlightProjectsTeaserBlock } from './highlight/highlight-projects-teaser';
import { HighlightShopTeaserBlock } from './highlight/highlight-shop-teaser';
import { IframeBlock } from './iframe';
import { LampshadeConfiguratorBlock } from './lampshade-configurator';
import { LocationBlock } from './location';
import { ImageBlock } from './image';
import { LogoGridBlock } from './logo-grid';
import { QuoteBlock } from './quote';
import { AllCategoriesBlock } from '@/integrations/datocms/blocks/shop/all-categories';
import { TeamBlock } from './team';
import { TeaserGridBlock } from './teaser-grid';
import { TeaserRowBlock } from './teaser-row';
import { TextBlock } from './text';
import { TextImageBlock } from './text-image';
import { TextThreeColBlock } from './text-three-col';
import { TextTwoColBlock } from './text-two-col';

export type ContentBlock = NonNullable<PageQuery['page']>['content'][number];

/** Blocks whose lead image can be the largest element of the first screen (LCP candidate). */
const IMAGE_LED_BLOCKS: ReadonlySet<ContentBlock['__typename']> = new Set([
  'ImageRecord',
  'TextImageRecord',
  'GalleryRecord',
  'TeamRecord',
  'HighlightProjectsTeaserRecord',
  'HighlightOffersTeaserRecord',
  'HighlightShopTeaserRecord',
]);

type Props = {
  blocks: ContentBlock[];
  /**
   * How many blocks from the top can be on the first screen. The first image-led block among them
   * loads its lead image with priority (LCP); all other images stay lazy so they do not compete.
   * Pass 0 when something else (e.g. the home stage) is rendered above the content.
   */
  eagerBlockCount?: number;
};

export const ContentBlocks: FC<Props> = ({ blocks, eagerBlockCount = 2 }) => {
  const lcpBlockIndex = blocks.findIndex(
    (block, index) => index < eagerBlockCount && IMAGE_LED_BLOCKS.has(block.__typename),
  );

  return (
    <>
      {blocks.map((block, index) => {
        const aboveFold = index === lcpBlockIndex;

        switch (block.__typename) {
          case 'TextRecord':
            return <TextBlock key={block.id} block={block} />;
          case 'TextTwoColumnRecord':
            return <TextTwoColBlock key={block.id} block={block} />;
          case 'TextThreeColumnRecord':
            return <TextThreeColBlock key={block.id} block={block} />;
          case 'TextImageRecord':
            return <TextImageBlock key={block.id} block={block} aboveFold={aboveFold} />;
          case 'ImageRecord':
            return <ImageBlock key={block.id} block={block} aboveFold={aboveFold} />;
          case 'TeamRecord':
            return <TeamBlock key={block.id} block={block} aboveFold={aboveFold} />;
          case 'IframeRecord':
            return <IframeBlock key={block.id} block={block} />;
          case 'LocationRecord':
            return <LocationBlock key={block.id} block={block} />;
          case 'LampshadeConfiguratorRecord':
            return <LampshadeConfiguratorBlock key={block.id} block={block} />;
          case 'QuoteRecord':
            return <QuoteBlock key={block.id} block={block} />;
          case 'GalleryRecord':
            return <GalleryBlock key={block.id} block={block} aboveFold={aboveFold} />;
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
          case 'ContactFormRecord':
            return <ContactFormBlock key={block.id} block={block} />;
          case 'FaqBlockRecord':
            return <FaqBlock key={block.id} block={block} />;
          case 'ProjectsBlockRecord':
            return <ProjectsBlock key={block.id} block={block} />;
          case 'ProjectsOverviewRecord':
            return <ProjectsOverviewBlock key={block.id} block={block} />;
          case 'HighlightProjectsTeaserRecord':
            return <HighlightProjectsTeaserBlock key={block.id} block={block} aboveFold={aboveFold} />;
          case 'HighlightOffersTeaserRecord':
            return <HighlightOffersTeaserBlock key={block.id} block={block} aboveFold={aboveFold} />;
          case 'HighlightShopTeaserRecord':
            return <HighlightShopTeaserBlock key={block.id} block={block} aboveFold={aboveFold} />;
          default:
            return null;
        }
      })}
    </>
  );
};
