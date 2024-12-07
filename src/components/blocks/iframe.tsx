import { IframeBlockFragment } from '@/graphql/generated';
import { FC } from 'react';
import { BlockWrapper } from '../block-wrapper';

type Props = {
  block: IframeBlockFragment;
};

export const IframeBlock: FC<Props> = ({ block: { src, disableMarginBottom, disableMarginTop } }) => (
  <BlockWrapper disableMarginBottom={disableMarginBottom} disableMarginTop={disableMarginTop}>
    <iframe
      title="Google Maps"
      className="mb-20"
      src={src}
      width="100%"
      height="500"
      allowFullScreen
      loading="lazy"
    ></iframe>
  </BlockWrapper>
);
