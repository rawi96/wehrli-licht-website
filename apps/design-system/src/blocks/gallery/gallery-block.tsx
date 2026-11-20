import { FC } from 'react';
import { GalleryGrid, GalleryItem } from '../../content/gallery-grid/gallery-grid';
import { Section } from '../../layout/section/section';
import type { BlockMargins } from '../block-margins';

type Props = BlockMargins & {
  items: GalleryItem[];
  /** Darkens the images and shows their titles on them. */
  showTitles?: boolean;
  /** Loads the first image with priority (LCP). */
  priority?: boolean;
};

/** Image gallery with lightbox. */
export const GalleryBlock: FC<Props> = ({ items, showTitles, priority, marginTop, marginBottom }) => (
  <Section marginBottom={marginBottom} marginTop={marginTop}>
    <GalleryGrid items={items} showTitles={showTitles} priority={priority} />
  </Section>
);
