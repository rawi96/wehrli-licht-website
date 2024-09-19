import NextLink from 'next/link';
import { FC, PropsWithChildren } from 'react';

type Props = PropsWithChildren<{ href: string; target?: string; rel?: string }>;

export const InlineLink: FC<Props> = ({ children, href, target, rel }) => (
  <NextLink
    href={href ?? '#'}
    target={target ?? '_self'}
    rel={rel}
    className="hover:border-signal border-b no-underline underline-offset-2 transition-colors focus:outline-none"
  >
    {children}
  </NextLink>
);
