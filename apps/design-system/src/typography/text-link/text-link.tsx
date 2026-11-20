import NextLink from 'next/link';
import { FC, ReactNode } from 'react';

/** A link from the CMS: label, resolved href and whether it opens in a new tab. */
export type LinkData = {
  label: string;
  href: string;
  newTab?: boolean | null;
};

type TextLinkProps = {
  children: ReactNode;
  href: string;
  newTab?: boolean;
  rel?: string;
  title?: string;
};

/** A link inside running text: underlined with the brand color. */
export const TextLink: FC<TextLinkProps> = ({ children, href, newTab, rel, title }) => (
  <NextLink
    href={href}
    target={newTab ? '_blank' : '_self'}
    rel={rel ?? (newTab ? 'noreferrer' : undefined)}
    title={title}
    className="border-wehrli text-wehrli hover:border-wehrli-700 hover:text-wehrli-700 border-b-2 no-underline transition-colors duration-150 focus:outline-none"
  >
    {children}
  </NextLink>
);

type CtaLinkProps = {
  children: ReactNode;
  href: string;
  newTab?: boolean;
};

/** A link that stands on its own, e.g. a link block in rich text: bold with a thick underline. */
export const CtaLink: FC<CtaLinkProps> = ({ children, href, newTab }) => (
  <NextLink
    href={href}
    target={newTab ? '_blank' : '_self'}
    rel={newTab ? 'noopener noreferrer' : undefined}
    className="border-wehrli text-wehrli hover:border-wehrli-700 hover:text-wehrli-700 mt-4 mr-8 inline-block border-b-2 font-bold no-underline transition-colors duration-150 md:text-sm lg:border-b-4 lg:text-base lg:peer-[a&]:ml-8"
  >
    {children}
  </NextLink>
);
