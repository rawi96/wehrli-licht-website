import { HeaderFooterRecord } from '@/graphql/generated';
import { mapFooterNavigationFromDato } from '@/utils/map-footer-navigation';
import Link from 'next/link';
import { FC, SVGProps } from 'react';
import { FooterContact } from './footer-contact';
import { FooterNavigationColumns } from './footer-navigation-columns';
import { FacebookIcon, InstagramIcon, LinkedinIcon } from './footer-social-icons';
import { footerBodyTextClassName, footerSocialLinkClassName, footerTextColorClassName } from './footer-styles';

type Props = {
  headerFooter: HeaderFooterRecord;
};

type SocialLink = {
  name: string;
  href: string;
  Icon: FC<SVGProps<SVGSVGElement>>;
};

const SOCIAL_LINKS: { name: string; key: keyof HeaderFooterRecord; Icon: SocialLink['Icon'] }[] = [
  { name: 'LinkedIn', key: 'linkedinUrl', Icon: LinkedinIcon },
  { name: 'Instagram', key: 'instagramUrl', Icon: InstagramIcon },
  { name: 'Facebook', key: 'facebookUrl', Icon: FacebookIcon },
];

export const Footer: FC<Props> = ({ headerFooter }) => {
  const { companyName } = headerFooter;
  const year = new Date().getFullYear();
  const footerSections = mapFooterNavigationFromDato(headerFooter);
  const socialLinks: SocialLink[] = SOCIAL_LINKS.flatMap(({ name, key, Icon }) => {
    const href = headerFooter[key];

    return typeof href === 'string' && href ? [{ name, href, Icon }] : [];
  });

  return (
    <footer className={`bg-wehrli ${footerTextColorClassName}`} aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Website-Footer
      </h2>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
          <div className="shrink-0 lg:w-64 xl:w-72">
            <FooterContact {...headerFooter} />
          </div>

          {footerSections.length > 0 && (
            <div className="min-w-0 flex-1 border-t border-white/10 pt-6 lg:border-t-0 lg:pt-0">
              <FooterNavigationColumns sections={footerSections} />
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className={footerBodyTextClassName}>
            &copy; {year} {companyName ?? 'Wehrli Licht GmbH'}. Alle Rechte vorbehalten.
          </p>

          {socialLinks.length > 0 && (
            <ul className="flex gap-4" aria-label="Social Media">
              {socialLinks.map(({ name, href, Icon }) => (
                <li key={name}>
                  <Link
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    prefetch={false}
                    className={footerSocialLinkClassName}
                  >
                    <span className="sr-only">{name}</span>
                    <Icon className="size-5 shrink-0" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
};
