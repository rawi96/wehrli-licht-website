import NextLink from 'next/link';
import { FC, PropsWithChildren } from 'react';

type Props = PropsWithChildren<{ href: string; target?: string; rel?: string }>;

export const InlineLink: FC<Props> = ({ children, href, target, rel }) => (
  <NextLink
    href={href ?? '#'}
    target={target ?? '_self'}
    rel={rel}
    className="border-b no-underline underline-offset-2 transition-colors hover:border-signal focus:outline-none"
  >
    {children}
  </NextLink>
);
