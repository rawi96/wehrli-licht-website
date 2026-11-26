'use client';

import NextImage from 'next/image';
import { FC, useEffect, useState } from 'react';
import { ImageCredit } from '../../content/image/image';
import { cn } from '../../fundamentals/cn';

export type HomeStageSlide = {
  id: string;
  src: string;
  /** Blurred placeholder (data URL) while the image loads. */
  blurDataURL?: string | null;
  /** Who the picture is from, shown small in the corner while the slide is on. */
  credit?: string | null;
};

export type HomeStageSlideshowLabels = {
  pause: string;
  play: string;
  /** Label of the group of slide buttons. */
  chooseSlide: string;
  /** Label of a slide button, `{index}` and `{count}` are replaced. */
  slide: string;
};

type Props = {
  slides: HomeStageSlide[];
  labels: HomeStageSlideshowLabels;
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

/** Background images of the home stage: cross-fading slideshow with a slow zoom, pause button and slide dots. */
export const HomeStageSlideshow: FC<Props> = ({ slides, labels, intervalMs = 7000 }) => {
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
              className={cn(
                'absolute inset-0 transition-opacity duration-[1800ms] ease-in-out motion-reduce:transition-none',
                isActive ? 'opacity-100' : 'opacity-0',
              )}
            >
              {/* next/image (not the DatoCMS image): full-bleed `fill` image, optimized by Next.js. */}
              <NextImage
                src={slide.src}
                alt=""
                fill
                priority={index === 0}
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchPriority={index === 0 ? 'high' : undefined}
                sizes="100vw"
                placeholder={slide.blurDataURL ? 'blur' : undefined}
                blurDataURL={slide.blurDataURL ?? undefined}
                className={cn(
                  'object-cover motion-reduce:scale-100',
                  isActive && 'animate-ken-burns',
                  isPaused && '[animation-play-state:paused]',
                )}
              />
            </div>
          );
        })}
      </div>

      {slides[activeIndex]?.credit && <ImageCredit credit={slides[activeIndex].credit} placement="stage" />}

      {hasMultipleSlides && (
        <div className="absolute bottom-24 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3">
          <button
            type="button"
            onClick={() => setIsPaused((value) => !value)}
            aria-label={isPaused ? labels.play : labels.pause}
            className="rounded-md p-1.5 text-white/80 transition-colors hover:text-white"
          >
            {isPaused ? <PlayIcon /> : <PauseIcon />}
          </button>
          <div className="flex" role="group" aria-label={labels.chooseSlide}>
            {slides.map((slide, index) => (
              // 24px tap target (WCAG 2.5.8) around the small visual dot.
              <button
                key={slide.id}
                type="button"
                aria-label={labels.slide.replace('{index}', String(index + 1)).replace('{count}', String(slides.length))}
                aria-current={index === activeIndex ? 'true' : undefined}
                onClick={() => setActiveIndex(index)}
                className="group/dot flex h-6 min-w-6 items-center justify-center rounded-full px-1"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-500',
                    index === activeIndex ? 'w-8 bg-white' : 'w-1.5 bg-white/40 group-hover/dot:bg-white/80',
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
