import { FC } from 'react';
import { Section } from '../../layout/section/section';
import type { BlockMargins } from '../block-margins';

type Props = BlockMargins & {
  src: string;
  /** Accessible name of the embedded page. */
  title?: string;
};

/** An embedded page (e.g. a map), 500px high over the content width, loaded lazily. */
export const IframeBlock: FC<Props> = ({ src, title = 'Google Maps', marginTop, marginBottom }) => (
  <Section marginBottom={marginBottom} marginTop={marginTop}>
    <iframe title={title} className="mb-20" src={src} width="100%" height="500" allowFullScreen loading="lazy" />
  </Section>
);
