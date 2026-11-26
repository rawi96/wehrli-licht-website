import NextLink from 'next/link';
import { FC, ReactNode } from 'react';

/** A link from the CMS: label, resolved href and whether it opens in a new tab. */
export type LinkData = {
  label: string;
  href: string;
  newTab?: boolean | null;
};

/**
 * Whether a link goes to a page of this site, which Next.js navigates to client-side and prefetches. Files
 * (`/downloads/a.pdf`), other sites, `mailto:` and `tel:` are plain links: prefetching them only causes errors.
 */
const isPageLink = (href: string) =>
  href.startsWith('/') && !href.startsWith('//') && !/\.[a-z0-9]{2,5}(?:[?#]|$)/i.test(href);

type TextLinkProps = {
  children: ReactNode;
  href: string;
  newTab?: boolean;
  rel?: string;
  title?: string;
};

/** A link inside running text: underlined with the brand color. */
export const TextLink: FC<TextLinkProps> = ({ children, href, newTab, rel, title }) => {
  const props = {
    href,
    target: newTab ? '_blank' : '_self',
    rel: rel ?? (newTab ? 'noreferrer' : undefined),
    title,
    className:
      'border-wehrli text-wehrli hover:border-wehrli-dark hover:text-wehrli-dark border-b-2 no-underline transition-colors',
  };

  return isPageLink(href) ? <NextLink {...props}>{children}</NextLink> : <a {...props}>{children}</a>;
};

type CtaLinkProps = {
  children: ReactNode;
  href: string;
  newTab?: boolean;
};

/** A link that stands on its own, e.g. a link block in rich text: bold with a thick underline. */
export const CtaLink: FC<CtaLinkProps> = ({ children, href, newTab }) => {
  const props = {
    href,
    target: newTab ? '_blank' : '_self',
    rel: newTab ? 'noopener noreferrer' : undefined,
    className:
      'border-wehrli text-wehrli hover:border-wehrli-dark hover:text-wehrli-dark mt-4 mr-8 inline-block border-b-2 font-bold no-underline transition-colors md:text-sm lg:border-b-4 lg:text-base lg:peer-[a&]:ml-8',
  };

  return isPageLink(href) ? <NextLink {...props}>{children}</NextLink> : <a {...props}>{children}</a>;
};
