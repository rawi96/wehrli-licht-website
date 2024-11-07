import { SearchParams } from '@/app/page';
import { PageModelContentField } from '@/graphql/generated';
import { FC } from 'react';
import { HistoryBlock } from './blocks/history';
import { TeamBlock } from './blocks/team';
import { TextBlock } from './blocks/text';
import { TextImageBlock } from './blocks/text-image';

type Props = {
  blocks: PageModelContentField[];
} & SearchParams;

export const ContentBlocks: FC<Props> = ({ blocks }) => {
  return (
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
          default:
            console.error('Unknown block type', block);

            return null;
        }
      })}
    </div>
  );
};
