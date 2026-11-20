import { ImageBlockFragment } from '@/graphql/generated';
import { toImage } from '@/utils/image';
import { ImageBlock as ImageBlockView } from '@wehrli/design-system';
import { FC } from 'react';

type Props = {
  block: ImageBlockFragment;
  aboveFold?: boolean;
};

export const ImageBlock: FC<Props> = ({
  block: { images, disableMarginBottom, disableMarginTop, priority: cmsPriority },
  aboveFold = false,
}) => (
  <ImageBlockView
    marginTop={!disableMarginTop}
    marginBottom={!disableMarginBottom}
    priority={cmsPriority || aboveFold}
    // The title is shown as caption, so it is no alt text.
    images={images.flatMap((file) => {
      const image = toImage(file, { altFromTitle: false });

      return image ? [{ id: file.id, image, caption: file.title }] : [];
    })}
  />
);
