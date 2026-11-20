import NextLink from 'next/link';
import { FC } from 'react';
import { Section } from '../../layout/section/section';
import type { BlockMargins } from '../block-margins';

type Logo = {
  id: string;
  /** URL of the logo file, usually an SVG. */
  src: string;
  width?: number | null;
  height?: number | null;
  alt: string;
  /** Website of the partner, opened in a new tab. */
  href: string;
};

type Props = BlockMargins & {
  logos: Logo[];
};

/** Partner logos: 3 per row, 4 from md, 6 from xl. Each links to the partner's website. */
export const LogoGridBlock: FC<Props> = ({ logos, marginTop, marginBottom }) => (
  <Section marginBottom={marginBottom} marginTop={marginTop}>
    <div className="grid grid-cols-3 gap-8 rounded-lg p-10 sm:gap-12 md:grid-cols-4 md:gap-16 xl:grid-cols-6">
      {logos.map((logo) => (
        <NextLink key={logo.id} href={logo.href} target="_blank" rel="noopener noreferrer" className="block">
          {/* Logos are SVGs: a responsive image would not help. */}
          <img
            src={logo.src}
            width={logo.width ?? undefined}
            height={logo.height ?? undefined}
            alt={logo.alt}
            loading="lazy"
            className="w-full"
          />
        </NextLink>
      ))}
    </div>
  </Section>
);
