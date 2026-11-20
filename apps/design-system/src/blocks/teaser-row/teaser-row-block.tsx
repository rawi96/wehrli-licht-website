import { ComponentProps, FC } from 'react';
import { TeaserTile } from '../../content/teaser-tile/teaser-tile';
import { Section } from '../../layout/section/section';
import type { BlockMargins } from '../block-margins';

type Props = BlockMargins & {
  teasers: (ComponentProps<typeof TeaserTile> & { id: string })[];
};

/** Page teasers as square tiles in a horizontally scrolling row. */
export const TeaserRowBlock: FC<Props> = ({ teasers, marginTop, marginBottom }) => (
  <Section marginBottom={marginBottom} marginTop={marginTop}>
    <div className="my-8">
      <div className="flex overflow-x-scroll pb-5">
        <div className="flex flex-nowrap gap-4">
          {teasers.map(({ id, ...teaser }) => (
            <TeaserTile key={id} {...teaser} />
          ))}
        </div>
      </div>
    </div>
  </Section>
);
