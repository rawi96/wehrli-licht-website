'use client';

import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

type Props = {
  slides: { key: string; src: string; width: number; height: number }[];
};

const LightboxModal = dynamic(() => import('./lightbox-modal').then((m) => m.LightboxModal), {
  ssr: false,
});

export const LightboxGate: FC<Props> = ({ slides }) => {
  const searchParams = useSearchParams();
  const search = searchParams?.get('image');

  if (!search) {
    return null;
  }

  return <LightboxModal slides={slides} search={search} />;
};
