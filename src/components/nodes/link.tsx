import { classNames } from '@/utils/css';
import NextLink from 'next/link';
import { FC, PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
  href: string;
  target?: string;
  rel?: string;
  title?: string;
  download?: boolean;
}>;

export const Link: FC<Props> = ({ children, href, target, download, rel, title }) => (
  <NextLink
    href={href ?? '#'}
    target={target ?? '_self'}
    download={download}
    rel={rel}
    className={classNames(
      'mr-4 mt-2 inline-block border-b-2 border-black text-sm font-bold no-underline transition-colors duration-150 hover:border-black md:text-sm lg:border-b-4 lg:text-base lg:peer-[a&]:ml-8',
    )}
    title={title}
  >
    {children}
  </NextLink>
);
