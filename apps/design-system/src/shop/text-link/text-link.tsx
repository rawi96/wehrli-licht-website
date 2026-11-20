import Link from 'next/link';
import type { LinkData } from '../../typography/text-link/text-link';
import { FC } from 'react';
import { cn } from '../../fundamentals/cn';

type Props = LinkData & {
  /** White text on dark surfaces. */
  inverted?: boolean;
  /** Space above: `stacked` on mobile only (below a section header's text), `top` at every width (below a card's text). */
  spacing?: 'stacked' | 'top';
};

/** A bold link with an arrow, e.g. "Alle Leuchten →" next to a section heading. At least 44px high. */
export const ShopTextLink: FC<Props> = ({ href, label, newTab, inverted, spacing }) => (
  <Link
    href={href}
    className={cn(
      'inline-flex min-h-11 shrink-0 items-center text-sm font-bold hover:underline',
      inverted ? 'text-white hover:text-white/80' : 'text-wehrli',
      spacing === 'stacked' && 'mt-4 md:mt-0',
      spacing === 'top' && 'mt-4',
    )}
    target={newTab ? '_blank' : undefined}
    rel={newTab ? 'noopener noreferrer' : undefined}
  >
    {label}
    <span aria-hidden="true"> →</span>
  </Link>
);
