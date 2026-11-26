'use client';

import { FC, useEffect, useRef, useState } from 'react';
import { cn } from '../../fundamentals/cn';

export type LoopVideoSource = {
  src: string;
  /** Media type, e.g. `video/webm` or `video/mp4`. */
  type: string;
};

type Props = {
  /** A short, silent clip of a few seconds in one or more formats; the browser takes the first it can play. */
  sources: LoopVideoSource[];
};

/**
 * A silent clip that loops over a picture (the picture is its placeholder, put it underneath). It loads only when it
 * comes near the screen, plays only while visible and fades in once it runs. Visitors who reduce motion keep the
 * picture. Decorative: the picture underneath carries the alt text.
 */
export const LoopVideo: FC<Props> = ({ sources }) => {
  const ref = useRef<HTMLVideoElement>(null);
  const [load, setLoad] = useState(false);
  const [playing, setPlaying] = useState(false);
  const visibleRef = useRef(false);

  // Watch the visibility: load the clip when it comes near the screen, play it only while visible.
  useEffect(() => {
    const video = ref.current;

    if (!video || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = Boolean(entry?.isIntersecting);

        if (!visibleRef.current) {
          video.pause();

          return;
        }

        setLoad(true);
        // Autoplay may be refused (e.g. power saving); the picture then simply stays.
        void video.play().catch(() => undefined);
      },
      { rootMargin: '200px' },
    );
    observer.observe(video);

    return () => observer.disconnect();
  }, []);

  // The source is added late, so the video has to pick it up before it can play.
  useEffect(() => {
    const video = ref.current;

    if (!load || !video) {
      return;
    }

    video.load();

    if (visibleRef.current) {
      void video.play().catch(() => undefined);
    }
  }, [load]);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
      onPlaying={() => setPlaying(true)}
      className={cn(
        'absolute inset-0 size-full object-cover transition-opacity duration-700 motion-reduce:hidden',
        playing ? 'opacity-100' : 'opacity-0',
      )}
    >
      {load && sources.map((source) => <source key={source.src} src={source.src} type={source.type} />)}
    </video>
  );
};
