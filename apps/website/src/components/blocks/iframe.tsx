import { Section } from '@wehrli/design-system';
import { IframeBlockFragment } from '@/graphql/generated';
import { FC } from 'react';

type Props = {
  block: IframeBlockFragment;
};

export const IframeBlock: FC<Props> = ({ block: { src, disableMarginBottom, disableMarginTop } }) => (
  <Section marginBottom={!disableMarginBottom} marginTop={!disableMarginTop}>
    <iframe title="Google Maps" className="mb-20" src={src} width="100%" height="500" allowFullScreen loading="lazy" />
  </Section>
);
