import { TeaserRowBlockFragment } from '@/graphql/generated';
import { toImage } from '../image';
import { getPublicPagePath } from '../paths';
import { TeaserRowBlock as TeaserRowBlockView } from '@wehrli/design-system';
import { FC } from 'react';

type Props = {
  block: TeaserRowBlockFragment;
};

export const TeaserRowBlock: FC<Props> = ({ block: { teasers, disableMarginBottom, disableMarginTop } }) => (
  <TeaserRowBlockView
    marginTop={!disableMarginTop}
    marginBottom={!disableMarginBottom}
    teasers={teasers.map((teaser) => ({
      id: teaser.id,
      href: getPublicPagePath(teaser),
      title: teaser.teaserTitle?.trim() ? teaser.teaserTitle.trim() : teaser.title,
      eyebrow: teaser.teaserEyebrow,
      linkLabel: teaser.teaserLinkText,
      image: toImage({
        responsiveImage: teaser.teaserImage?.responsiveImage,
        copyright: teaser.teaserImage?.copyright,
      }),
    }))}
  />
);
