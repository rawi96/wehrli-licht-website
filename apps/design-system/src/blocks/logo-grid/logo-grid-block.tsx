import { FC } from 'react';
import { LinkButton } from '../../actions/button/button';
import { cn } from '../../fundamentals/cn';
import { Section } from '../../layout/section/section';
import type { LinkData } from '../../typography/text-link/text-link';
import type { BlockMargins } from '../block-margins';

type Logo = {
  id: string;
  /** URL of the logo file. */
  src: string;
  width?: number | null;
  height?: number | null;
  alt: string;
  /** Website of the partner, opened in a new tab. */
  href: string;
};

type Props = BlockMargins & {
  logos: Logo[];
  /** Below the logos, e.g. «Alle Partner ansehen». */
  link?: LinkData | null;
};

/** Seconds per logo: the band moves at the same calm speed however many logos it has. */
const SECONDS_PER_LOGO = 4;

const LogoTile: FC<{ logo: Logo; hidden?: boolean }> = ({ logo, hidden = false }) => (
  <a
    href={logo.href}
    target="_blank"
    rel="noopener noreferrer"
    aria-hidden={hidden || undefined}
    tabIndex={hidden ? -1 : undefined}
    title={logo.alt}
    className="group/logo flex h-24 w-44 shrink-0 items-center justify-center rounded-md bg-white px-6 py-4 shadow-sm transition-shadow hover:shadow-md sm:w-52"
  >
    {/* Logos come in many formats: shown whole, never cropped. */}
    <img
      src={logo.src}
      width={logo.width ?? undefined}
      height={logo.height ?? undefined}
      alt={hidden ? '' : logo.alt}
      loading="lazy"
      className="max-h-full w-auto max-w-full object-contain opacity-70 grayscale transition duration-300 group-hover/logo:opacity-100 group-hover/logo:grayscale-0"
    />
  </a>
);

/** A few logos stand still, centred: a band needs more logos than fit on the screen. */
const MIN_ANIMATED = 6;

const StaticRow: FC<{ logos: Logo[] }> = ({ logos }) => (
  <ul className="flex flex-wrap justify-center gap-4 py-2">
    {logos.map((logo) => (
      <li key={logo.id}>
        <LogoTile logo={logo} />
      </li>
    ))}
  </ul>
);

/** One endless row: the logos twice in a row, moved by half its width, so the loop has no seam. */
const Row: FC<{ logos: Logo[]; reverse?: boolean }> = ({ logos, reverse = false }) => (
  <div className="group/row overflow-hidden mask-x-from-90% mask-x-to-100% py-2 motion-reduce:mask-none">
    <ul
      className={cn(
        'flex w-max gap-4 group-hover/row:[animation-play-state:paused] motion-reduce:w-auto motion-reduce:flex-wrap motion-reduce:justify-center',
        reverse ? 'animate-marquee-reverse' : 'animate-marquee',
      )}
      // The duration depends on the number of logos, a value from the content.
      style={{ animationDuration: `${logos.length * SECONDS_PER_LOGO}s` }}
    >
      {logos.map((logo) => (
        <li key={logo.id}>
          <LogoTile logo={logo} />
        </li>
      ))}
      {logos.map((logo) => (
        <li key={`copy-${logo.id}`} className="motion-reduce:hidden">
          <LogoTile logo={logo} hidden />
        </li>
      ))}
    </ul>
  </div>
);

/**
 * Partner logos as an endless band: two rows that drift slowly in opposite directions and stop on hover. Logos are
 * calm in grey and show their colours on hover. With reduced motion the logos stand still, wrapped in rows.
 */
export const LogoGridBlock: FC<Props> = ({ logos, link, marginTop, marginBottom }) => {
  const half = Math.ceil(logos.length / 2);
  const rows =
    logos.length > 8
      ? [
          { id: 'first', logos: logos.slice(0, half) },
          { id: 'second', logos: logos.slice(half) },
        ]
      : [{ id: 'first', logos }];

  return (
    <Section marginBottom={marginBottom} marginTop={marginTop}>
      <div className="flex flex-col gap-2">
        {rows.map((row) =>
          logos.length < MIN_ANIMATED ? (
            <StaticRow key={row.id} logos={row.logos} />
          ) : (
            <Row key={row.id} logos={row.logos} reverse={row.id === 'second'} />
          ),
        )}
      </div>
      {link ? (
        <div className="mt-8 flex justify-center">
          <LinkButton link={link} variant="secondary" showArrow />
        </div>
      ) : null}
    </Section>
  );
};
