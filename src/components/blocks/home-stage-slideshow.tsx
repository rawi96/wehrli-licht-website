'use client';

import { classNames } from '@/utils/css';
import Image from 'next/image';
import { FC, useEffect, useState } from 'react';

export type HomeStageSlide = {
  id: string;
  src: string;
  blurDataURL?: string | null;
};

type Props = {
  slides: HomeStageSlide[];
  intervalMs?: number;
};

const PauseIcon = () => (
  <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
  </svg>
);

const PlayIcon = () => (
  <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8 5v14l11-7L8 5z" />
  </svg>
);

export const HomeStageSlideshow: FC<Props> = ({ slides, intervalMs = 7000 }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const hasMultipleSlides = slides.length > 1;

  useEffect(() => {
    if (!hasMultipleSlides || isPaused) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [hasMultipleSlides, isPaused, intervalMs, slides.length]);

  if (slides.length === 0) {
    return null;
  }

  return (
    <>
      <div className="absolute inset-0 -z-20 overflow-hidden" aria-hidden="true">
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              key={slide.id}
              className={classNames(
                'absolute inset-0 transition-opacity duration-[1800ms] ease-in-out motion-reduce:transition-none',
                isActive ? 'opacity-100' : 'opacity-0',
              )}
            >
              <Image
                src={slide.src}
                alt=""
                fill
                priority={index === 0}
                loading={index === 0 ? 'eager' : 'lazy'}
                sizes="100vw"
                placeholder={slide.blurDataURL ? 'blur' : undefined}
                blurDataURL={slide.blurDataURL ?? undefined}
                className={classNames('object-cover motion-reduce:scale-100', isActive && 'animate-ken-burns')}
                style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
              />
            </div>
          );
        })}
      </div>

      {hasMultipleSlides && (
        <div className="absolute bottom-24 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3">
          <button
            type="button"
            onClick={() => setIsPaused((value) => !value)}
            aria-label={isPaused ? 'Diashow fortsetzen' : 'Diashow pausieren'}
            className="rounded-sm p-1.5 text-white/70 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none"
          >
            {isPaused ? <PlayIcon /> : <PauseIcon />}
          </button>
          <div className="flex gap-2" role="group" aria-label="Hintergrundbild auswählen">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Bild ${index + 1} von ${slides.length}`}
                aria-current={index === activeIndex ? 'true' : undefined}
                onClick={() => setActiveIndex(index)}
                className={classNames(
                  'h-1.5 rounded-full transition-all duration-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none',
                  index === activeIndex ? 'w-8 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70',
                )}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};
