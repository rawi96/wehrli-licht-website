'use client';

import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

export type LightboxSlide = {
  /** Matched against the `?image=` search parameter. */
  key: string;
  src: string;
  width: number;
  height: number;
};

type Props = {
  slides: LightboxSlide[];
};

const LightboxModal = dynamic(() => import('./lightbox-modal').then((m) => m.LightboxModal), {
  ssr: false,
});

/**
 * Full-screen image viewer, opened by the `?image=<key>` search parameter (links with `href="?image=<key>"`), closed by
 * removing it. The viewer code loads only once an image is opened. Render it inside `<Suspense>` (it reads search params).
 */
export const Lightbox: FC<Props> = ({ slides }) => {
  const searchParams = useSearchParams();
  const search = searchParams?.get('image');

  if (!search) {
    return null;
  }

  return <LightboxModal slides={slides} search={search} />;
};
