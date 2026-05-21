import { classNames } from '@/utils/css';
import Link from 'next/link';
import { FC } from 'react';

type Props = {
  href: string;
  label: string;
  className?: string;
  inverted?: boolean;
  newTab?: boolean;
};

export const ShopTextLink: FC<Props> = ({ href, label, className, inverted, newTab }) => (
  <Link
    href={href}
    className={classNames(
      'inline-flex min-h-11 shrink-0 items-center text-sm font-bold hover:underline',
      inverted ? 'text-white hover:text-white/80' : 'text-wehrli',
      className,
    )}
    target={newTab ? '_blank' : undefined}
    rel={newTab ? 'noopener noreferrer' : undefined}
  >
    {label}
    <span aria-hidden="true"> →</span>
  </Link>
);
