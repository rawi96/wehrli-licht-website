import { FC, ReactNode } from 'react';
import { Button } from '../../actions/button/button';
import { Heading } from '../../typography/heading/heading';
import { HomeStageSlide, HomeStageSlideshow, HomeStageSlideshowLabels } from './home-stage-slideshow';

export type { HomeStageSlide } from './home-stage-slideshow';

type Cta = { label: string; href: string };

type Props = {
  title: string;
  intro?: string | null;
  /** Up to two calls to action: the first is the primary button, the second a text button. */
  ctas: Cta[];
  /** Background images; with more than one they change every 7 seconds. */
  slides: HomeStageSlide[];
  /** The header, laid over the stage (transparent variant). */
  header?: ReactNode;
  labels?: Partial<HomeStageSlideshowLabels & { scroll: string }>;
};

const DEFAULT_LABELS = {
  scroll: 'Scrollen',
  pause: 'Diashow pausieren',
  play: 'Diashow fortsetzen',
  chooseSlide: 'Hintergrundbild auswählen',
  slide: 'Bild {index} von {count}',
};

const Reveal: FC<{ children: ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <div
    className="animate-hero-reveal opacity-0 motion-reduce:animate-none motion-reduce:opacity-100"
    style={{ animationDelay: `${delay}ms` }}
  >
    {children}
  </div>
);

/** Full-screen stage at the top of the home page: background slideshow, header, title, intro and calls to action. */
export const HomeStageBlock: FC<Props> = ({ title, intro, ctas, slides, header, labels: customLabels }) => {
  const labels = { ...DEFAULT_LABELS, ...customLabels };
  const [primaryCta, secondaryCta] = ctas;

  return (
    <section aria-labelledby="home-stage-heading" className="bg-wehrli-700">
      <div className="relative isolate min-h-[100svh] overflow-hidden">
        <HomeStageSlideshow slides={slides} labels={labels} />

        <div className="from-wehrli-700/75 via-wehrli-700/50 to-wehrli-700/90 pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_90%_70%_at_50%_45%,rgb(8_15_28/0.55),transparent_65%)]" />
        <div className="animate-light-beam pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgb(101_142_211/0.2),transparent_70%)] motion-reduce:animate-none" />

        <div className="from-wehrli-700/85 via-wehrli-700/45 pointer-events-none absolute inset-x-0 top-0 z-0 h-40 bg-gradient-to-b to-transparent" />

        <div className="relative z-10">{header}</div>

        <div className="mx-auto flex min-h-[calc(100svh-5rem)] max-w-7xl items-center px-6 lg:px-8">
          <div className="hero-text-shadow relative mx-auto w-full max-w-3xl py-24 text-center sm:py-32">
            <Reveal>
              <Heading color="white" level="1" id="home-stage-heading">
                <span className="tracking-tight text-balance">{title}</span>
              </Heading>
            </Reveal>

            <Reveal delay={150}>
              <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-balance text-white md:text-base lg:mt-8 lg:text-lg">
                {intro}
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-x-6">
                {primaryCta && (
                  <Button variant="primary" href={primaryCta.href}>
                    {primaryCta.label}
                  </Button>
                )}
                {secondaryCta && (
                  <Button variant="secondary-white" href={secondaryCta.href}>
                    {secondaryCta.label}
                  </Button>
                )}
              </div>
            </Reveal>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2" aria-hidden="true">
          <div className="animate-scroll-hint flex flex-col items-center gap-2 motion-reduce:animate-none">
            <span className="text-xxs tracking-widest text-white/50 uppercase">{labels.scroll}</span>
            <svg className="h-5 w-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};
