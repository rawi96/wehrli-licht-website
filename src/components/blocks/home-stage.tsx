import { HeaderFooterDocument, HeaderFooterRecord, HomeStageBlockFragment } from '@/graphql/generated';
import { queryDatoCMS } from '@/utils/query-dato-cms';
import { draftMode } from 'next/headers';
import { FC } from 'react';
import { Button } from '../button';
import { Header } from '../layout/header';
import { Heading } from '../nodes';
import { HeroReveal } from './home-stage-content';
import { HomeStageSlideshow, HomeStageSlide } from './home-stage-slideshow';

type Props = {
  block: HomeStageBlockFragment;
};

const toSlide = (
  id: string,
  responsiveImage: NonNullable<HomeStageBlockFragment['image']>['responsiveImage'],
): HomeStageSlide | null => {
  if (!responsiveImage?.src) {
    return null;
  }

  return {
    id,
    src: responsiveImage.src,
    blurDataURL: responsiveImage.base64,
  };
};

const buildSlides = (block: HomeStageBlockFragment): HomeStageSlide[] => {
  const slides: HomeStageSlide[] = [];

  const primary = block.image?.responsiveImage ? toSlide('primary-image', block.image.responsiveImage) : null;
  if (primary) {
    slides.push(primary);
  }

  for (const image of block.slideshowImages ?? []) {
    const slide = image?.responsiveImage ? toSlide(image.id ?? image.responsiveImage.src, image.responsiveImage) : null;
    if (slide) {
      slides.push(slide);
    }
  }

  return slides;
};

const ctaHref = (cta: HomeStageBlockFragment['callToActions'][number]) => (cta.link?.slug ?? '') + (cta.anchorLink ?? '');

export const HomeStageBlock: FC<Props> = async ({ block }) => {
  const { title, intro, callToActions } = block;
  const slides = buildSlides(block);

  const { isEnabled } = await draftMode();
  const { headerFooter } = await queryDatoCMS({
    document: HeaderFooterDocument,
    includeDrafts: isEnabled,
  });

  return (
    <section aria-labelledby="home-stage-heading" className="bg-wehrli-700">
      <div className="relative isolate min-h-[100svh] overflow-hidden">
        <HomeStageSlideshow slides={slides} />

        <div className="from-wehrli-700/75 via-wehrli-700/50 to-wehrli-700/90 pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_90%_70%_at_50%_45%,rgb(8_15_28/0.55),transparent_65%)]" />
        <div className="animate-light-beam pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgb(101_142_211/0.2),transparent_70%)] motion-reduce:animate-none" />

        <div className="from-wehrli-700/85 via-wehrli-700/45 pointer-events-none absolute inset-x-0 top-0 z-0 h-40 bg-gradient-to-b to-transparent" />

        <div className="relative z-10">
          <Header headerFooter={headerFooter as HeaderFooterRecord} variant="overlay" />
        </div>

        <div className="mx-auto flex min-h-[calc(100svh-5rem)] max-w-7xl items-center px-6 lg:px-8">
          <div className="hero-text-shadow relative mx-auto w-full max-w-3xl py-24 text-center sm:py-32">
            <HeroReveal>
              <Heading color="white" level="1" id="home-stage-heading">
                <span className="tracking-tight text-balance">{title}</span>
              </Heading>
            </HeroReveal>

            <HeroReveal delay={150}>
              <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-balance text-white md:text-base lg:mt-8 lg:text-lg">
                {intro}
              </p>
            </HeroReveal>

            <HeroReveal delay={300}>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-x-6">
                {callToActions[0] && (
                  <Button type="primary" text={callToActions[0].label} href={ctaHref(callToActions[0])} />
                )}
                {callToActions[1] && (
                  <Button type="secondary" white text={callToActions[1].label} href={ctaHref(callToActions[1])} />
                )}
              </div>
            </HeroReveal>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2" aria-hidden="true">
          <div className="animate-scroll-hint flex flex-col items-center gap-2 motion-reduce:animate-none">
            <span className="text-xxs tracking-widest text-white/50 uppercase">Scrollen</span>
            <svg className="h-5 w-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};
