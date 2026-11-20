import Link from 'next/link';
import { FC } from 'react';
import { cn } from '../../fundamentals/cn';

export type ShopLink = {
  href: string;
  label: string;
  newTab?: boolean | null;
};

type Props = ShopLink & {
  /** White text on dark surfaces. */
  inverted?: boolean;
  /** Space above on mobile, where the link stacks below a section header's text (none from md). */
  stacked?: boolean;
};

/** A bold link with an arrow, e.g. "Alle Leuchten →" next to a section heading. At least 44px high. */
export const ShopTextLink: FC<Props> = ({ href, label, newTab, inverted, stacked }) => (
  <Link
    href={href}
    className={cn(
      'inline-flex min-h-11 shrink-0 items-center text-sm font-bold hover:underline',
      inverted ? 'text-white hover:text-white/80' : 'text-wehrli',
      stacked && 'mt-4 md:mt-0',
    )}
    target={newTab ? '_blank' : undefined}
    rel={newTab ? 'noopener noreferrer' : undefined}
  >
    {label}
    <span aria-hidden="true"> →</span>
  </Link>
);
