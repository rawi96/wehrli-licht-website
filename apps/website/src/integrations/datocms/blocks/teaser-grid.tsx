import { TeaserGridBlockFragment } from '@/graphql/generated';
import { toImage } from '../image';
import { TeaserGridBlock as TeaserGridBlockView } from '@wehrli/design-system';
import { FC } from 'react';

type Props = {
  block: TeaserGridBlockFragment;
};

export const TeaserGridBlock: FC<Props> = ({ block: { teasers, disableMarginBottom, disableMarginTop } }) => (
  <TeaserGridBlockView
    marginTop={!disableMarginTop}
    marginBottom={!disableMarginBottom}
    teasers={teasers.map((teaser) => {
      const href = `${teaser.parent?.slug ? `/${teaser.parent?.slug}` : ''}/${teaser.slug}`;

      return {
        id: teaser.id,
        title: teaser.teaserTitle ?? '',
        description: teaser.teaserDescription,
        href,
        // Project pages are many and rarely opened from the grid: no prefetch.
        prefetch: href.startsWith('/projekte/') ? false : undefined,
        linkLabel: teaser.teaserLinkText ?? 'Anschauen',
        image: toImage({ responsiveImage: teaser.teaserImage?.responsiveImage }),
        eyebrow: teaser.teaserEyebrow,
      };
    })}
  />
);
