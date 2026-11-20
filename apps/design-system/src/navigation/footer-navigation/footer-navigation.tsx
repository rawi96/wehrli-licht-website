import Link from 'next/link';
import { FC } from 'react';
import { FOOTER_HEADING_CLASS, FOOTER_LINK_CLASS } from '../../layout/footer/footer-styles';
import type { NavigationLink } from '../flyout/flyout';

export type FooterNavigationSection = {
  title: string;
  links: NavigationLink[];
};

type Props = {
  sections: FooterNavigationSection[];
};

const footerNavId = (title: string): string =>
  `footer-nav-${title
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')}`;

/** Link columns of the footer, one labelled navigation per section. */
export const FooterNavigation: FC<Props> = ({ sections }) => (
  <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 sm:gap-x-8 lg:gap-x-10">
    {sections.map((section) => {
      const headingId = footerNavId(section.title);

      return (
        <nav key={section.title} aria-labelledby={headingId} className="min-w-0">
          <h3 id={headingId} className={FOOTER_HEADING_CLASS}>
            {section.title}
          </h3>
          <ul className="mt-2 space-y-1">
            {section.links.map((item) => (
              <li key={item.href}>
                <Link href={item.href} prefetch={false} className={FOOTER_LINK_CLASS}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      );
    })}
  </div>
);
