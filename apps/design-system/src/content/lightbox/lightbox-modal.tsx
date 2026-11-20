'use client';

import NextImage from 'next/image';
import { useRouter } from 'next/navigation';
import { FC, useMemo } from 'react';
import { Lightbox as LightboxComponent } from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import type { LightboxSlide } from './lightbox';

type Props = {
  slides: LightboxSlide[];
  search: string;
};

export const LightboxModal: FC<Props> = ({ slides, search }) => {
  const router = useRouter();
  const currentImage = useMemo(() => slides.findIndex((slide) => slide.key.includes(search)), [search, slides]);

  return (
    <LightboxComponent
      open={currentImage !== -1}
      close={() =>
        router.push(`?`, {
          scroll: false,
        })
      }
      index={currentImage}
      render={{
        slide: ({ slide: { src, width, height } }) => (
          // eslint-disable-next-line @smartive-eslint/forbid-component-props -- next/image only takes classes
          <NextImage src={src} width={width} height={height} alt="" className="max-h-[90vh] max-w-[90vw] object-contain" />
        ),
      }}
      slides={slides}
    />
  );
};
