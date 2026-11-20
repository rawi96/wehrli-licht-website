import { FC, ReactNode } from 'react';
import { Heading } from '../../typography/heading/heading';
import { LinkData } from '../../typography/text-link/text-link';
import { ShopTextLink } from '../text-link/text-link';

type Props = {
  headingId: string;
  title: string;
  /** Text below the heading: plain text or rich text. */
  description: ReactNode;
  /** Link at the right of the heading (below it on mobile). */
  action?: LinkData | null;
  /** White heading and link on dark surfaces. */
  inverted?: boolean;
};

/** Heading, intro text and an optional link of a storefront section. */
export const ShopSectionHeader: FC<Props> = ({ headingId, title, description, action, inverted }) => (
  <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-6">
    <div className="max-w-2xl [&_h2]:mb-3 sm:[&_h2]:mb-6">
      <Heading level="2" id={headingId} color={inverted ? 'white' : undefined}>
        {title}
      </Heading>
      <div className="-mt-1 text-sm leading-relaxed md:-mt-2 md:text-base">{description}</div>
    </div>
    {action && <ShopTextLink {...action} inverted={inverted} spacing="stacked" />}
  </div>
);
