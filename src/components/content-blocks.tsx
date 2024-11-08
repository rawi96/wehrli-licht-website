import { SearchParams } from '@/app/page';
import { GalleryBlockFragment, PageModelContentField } from '@/graphql/generated';
import { FC } from 'react';
import { GalleryBlock } from './blocks/gallery';
import { HeaderSectionBlock } from './blocks/header-section';
import { HistoryBlock } from './blocks/history';
import { HomeStageBlock } from './blocks/home-stage';
import { IframeBlock } from './blocks/iframe';
import { ImageGridBlock } from './blocks/image-grid';
import { LogoGridBlock } from './blocks/logo-grid';
import { QuoteBlock } from './blocks/quote';
import { TeamBlock } from './blocks/team';
import { TextBlock } from './blocks/text';
import { TextImageBlock } from './blocks/text-image';

type Props = {
  blocks: PageModelContentField[];
} & SearchParams;

export const ContentBlocks: FC<Props> = ({ blocks }) => {
  return (
    <>
      {blocks.map((block) => {
        if (block.__typename === 'HomeStageRecord') {
          return <HomeStageBlock key={block.id} block={block} />;
        }

        return null;
      })}

      <div className="max-w-content mx-auto my-24 w-11/12 peer-[]/hero-video:mt-16 md:my-36">
        {blocks.map((block) => {
          switch (block.__typename) {
            case 'TextRecord':
              return <TextBlock key={block.id} block={block} />;
            case 'TextImageRecord':
              return <TextImageBlock key={block.id} block={block} />;
            case 'TeamRecord':
              return <TeamBlock key={block.id} block={block} />;
            case 'HistoryRecord':
              return <HistoryBlock key={block.id} block={block} />;
            case 'IframeRecord':
              return <IframeBlock key={block.id} block={block} />;
            case 'HeaderSectionRecord':
              return <HeaderSectionBlock key={block.id} block={block} />;
            case 'QuoteRecord':
              return <QuoteBlock key={block.id} block={block} />;
            case 'GalleryRecord':
              return <GalleryBlock key={block.id} block={block as unknown as GalleryBlockFragment} />;
            case 'ImageGridRecord':
              return <ImageGridBlock key={block.id} block={block} />;
            case 'LogoGridRecord':
              return <LogoGridBlock key={block.id} block={block} />;
            default:
              console.error('Unknown block type', block);

              return null;
          }
        })}
      </div>
    </>
  );
};
