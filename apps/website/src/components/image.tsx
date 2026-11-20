import { toImage } from '@/utils/image';
import { Image } from '@wehrli/design-system';
import { ComponentProps, FC } from 'react';

type Props = Omit<ComponentProps<typeof Image>, 'image' | 'placeholder'> & {
  image: Parameters<typeof toImage>[0];
  altFromTitle?: boolean;
  usePlaceholder?: boolean;
};

/** Transitional: a DatoCMS file rendered with the design system's Image. Gone once all blocks live in the design system. */
export const ImageComponent: FC<Props> = ({ image, altFromTitle, usePlaceholder, ...props }) => (
  // eslint-disable-next-line jsx-a11y-x/alt-text -- the alt text is part of the image data (toImage)
  <Image image={toImage(image, { altFromTitle })} placeholder={usePlaceholder} {...props} />
);
