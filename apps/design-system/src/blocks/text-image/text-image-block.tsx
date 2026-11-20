import { FC, ReactNode } from 'react';
import { Image, ImageData } from '../../content/image/image';
import { cn } from '../../fundamentals/cn';
import { CONTENT_IMAGE_SIZES } from '../../layout/grid/grid';
import { Section } from '../../layout/section/section';
import type { BlockMargins } from '../block-margins';

type Props = BlockMargins & {
  /** Rich text beside the image. */
  content?: ReactNode;
  image?: ImageData | null;
  /** Side of the image from md. On mobile the image is above the text, with `image-right` below it. */
  layout?: 'image-left' | 'image-right';
  anchorId?: string | null;
  /** Loads the image with priority (LCP), for a block at the top of the page. */
  priority?: boolean;
};

/** Image (2/5) and rich text (3/5) side by side from md. */
export const TextImageBlock: FC<Props> = ({
  content,
  image,
  layout = 'image-left',
  anchorId,
  priority,
  marginTop,
  marginBottom,
}) => (
  <Section id={anchorId} marginBottom={marginBottom} marginTop={marginTop}>
    <div
      className={cn(
        'flex flex-col items-center gap-8 md:flex-row xl:gap-16',
        layout === 'image-right' && 'flex-col-reverse md:flex-row-reverse',
      )}
    >
      {image && (
        <div className="basis-2/5">
          <Image image={image} priority={priority} sizes={CONTENT_IMAGE_SIZES.twoFifths} rounded="lg" />
        </div>
      )}
      {content ? <div className="basis-3/5">{content}</div> : null}
    </div>
  </Section>
);
