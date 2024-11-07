import { IframeBlockFragment } from '@/graphql/generated';
import { FC } from 'react';
import { BlockWrapper } from '../block-wrapper';

type Props = {
  block: IframeBlockFragment;
};

export const IframeBlock: FC<Props> = ({ block: { src } }) => (
  <BlockWrapper>
    <iframe className="mb-20" src={src} width="100%" height="500" allowFullScreen loading="lazy"></iframe>
  </BlockWrapper>
);
