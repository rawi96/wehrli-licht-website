'use client';

import React, {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  LinkHTMLAttributes,
  MouseEvent,
  ReactNode,
  forwardRef,
} from 'react';

type Base = {
  as?: 'a' | 'button';
  variant?: 'solid' | 'naked';
  children: ReactNode;
};

type Button = {
  as: 'button';
  onClick(e: MouseEvent): void;
} & ButtonHTMLAttributes<HTMLButtonElement> &
  Base;

type Link = {
  as?: 'a';
  href?: string;
  newTab?: boolean;
  onClick?(e: MouseEvent): void;
} & LinkHTMLAttributes<HTMLElement> &
  Base;

type TextLinkProps = Link | Button;

const isLink = (props: TextLinkProps): props is Link => props.as !== 'button';

/**
 * Unfortunately right now `forwardRef` can't deal with generic/dynamic components (this should be `forwardRef<HTMLButtonElement | HTMLAnchorElement, LinkProps>`).
 * So we have to use any. 😭
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TextLink = forwardRef<any, TextLinkProps>((props, ref) => {
  const { children } = props;
  const className =
    'border-b-2 border-wehrli text-wehrli hover:text-wehrli-700 hover:border-wehrli-700 no-underline transition-colors duration-150 focus:outline-none';

  if (isLink(props)) {
    const { newTab, href, ...rest } = props;
    const target = newTab ? '_blank' : '_self';
    const rel = newTab ? 'noreferrer' : '';

    return (
      <a
        href={href}
        ref={ref}
        target={target}
        rel={rel}
        className={className}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }

  return (
    <button ref={ref} className={className} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
});
