import { TeaserGridBlockFragment } from '@/graphql/generated';
import { toImage } from '../image';
import { getPublicPagePath } from '../paths';
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
      const href = getPublicPagePath(teaser);

      return {
        id: teaser.id,
        // An empty teaser title means the page title (hint in DatoCMS).
        title: teaser.teaserTitle?.trim() ? teaser.teaserTitle.trim() : teaser.title,
        description: teaser.teaserDescription,
        href,
        // Project pages are many and rarely opened from the grid: no prefetch.
        prefetch: href.startsWith('/projekte/') ? false : undefined,
        linkLabel: teaser.teaserLinkText ?? 'Anschauen',
        image: toImage(teaser.teaserImage),
        eyebrow: teaser.teaserEyebrow,
      };
    })}
  />
);
