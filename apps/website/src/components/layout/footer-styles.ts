export const footerTextColorClassName = 'text-white/90';
export const footerMutedTextClassName = 'text-white/85';
export const footerHeadingClassName = 'text-xs font-bold text-white sm:text-sm';

export const footerBodyTextClassName = `text-xs leading-5 ${footerTextColorClassName} sm:text-sm sm:leading-6`;

export const footerLinkClassName = `inline-block rounded-sm py-0.5 text-xs leading-5 ${footerTextColorClassName} transition-colors hover:text-white sm:py-1 sm:text-sm sm:leading-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-wehrli`;

export const footerSocialLinkClassName = `${footerLinkClassName} p-1.5`;

export const footerFormattedTextClassName = `footer-prose mt-1.5 ${footerBodyTextClassName} [&_a]:text-white [&_a]:underline [&_a]:hover:text-white [&_li+li]:mt-0.5 [&_p]:m-0 [&_p+p]:mt-1.5 [&_ul]:mt-1`;

export const footerNavId = (title: string): string =>
  `footer-nav-${title
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')}`;
