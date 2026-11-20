import { IframeBlockFragment } from '@/graphql/generated';
import { IframeBlock as IframeBlockView } from '@wehrli/design-system';
import { FC } from 'react';

type Props = {
  block: IframeBlockFragment;
};

export const IframeBlock: FC<Props> = ({ block: { src, disableMarginBottom, disableMarginTop } }) => (
  <IframeBlockView src={src} marginTop={!disableMarginTop} marginBottom={!disableMarginBottom} />
);
