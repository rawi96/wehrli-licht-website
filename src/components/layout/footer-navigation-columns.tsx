import { footerHeadingClassName, footerLinkClassName, footerNavId } from '@/components/layout/footer-styles';
import { FooterNavSection } from '@/utils/map-footer-navigation';
import Link from 'next/link';
import { FC } from 'react';

type Props = {
  sections: FooterNavSection[];
};

export const FooterNavigationColumns: FC<Props> = ({ sections }) => (
  <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 sm:gap-x-8 lg:gap-x-10">
    {sections.map((section) => {
      const headingId = footerNavId(section.title);

      return (
        <nav key={section.title} aria-labelledby={headingId} className="min-w-0">
          <h3 id={headingId} className={footerHeadingClassName}>
            {section.title}
          </h3>
          <ul className="mt-2 space-y-1">
            {section.links.map((item) => (
              <li key={item.href}>
                <Link href={item.href} prefetch={false} className={footerLinkClassName}>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      );
    })}
  </div>
);
