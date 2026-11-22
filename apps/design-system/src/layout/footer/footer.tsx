import Link from 'next/link';
import { FC, ReactNode } from 'react';
import { SOCIAL_NETWORK_NAMES, SocialIcon, SocialNetwork } from '../../icons/social-icon/social-icon';
import { FooterNavigation, FooterNavigationSection } from '../../navigation/footer-navigation/footer-navigation';
import { FooterContact, FooterContactProps } from '../footer-contact/footer-contact';
import { FOOTER_BODY_TEXT_CLASS, FOOTER_LINK_CLASS } from './footer-styles';

export type SocialLink = {
  network: SocialNetwork;
  href: string;
};

type FooterLabels = {
  /** Screen reader heading of the footer. */
  heading: string;
  rightsReserved: string;
  privacy: string;
  socialMedia: string;
};

const DEFAULT_LABELS: FooterLabels = {
  heading: 'Website-Footer',
  rightsReserved: 'Alle Rechte vorbehalten.',
  privacy: 'Datenschutz',
  socialMedia: 'Social Media',
};

type Props = {
  contact: FooterContactProps;
  navigation: FooterNavigationSection[];
  /** Name in the copyright line. */
  copyrightHolder: string;
  /** Year in the copyright line, usually the current year. */
  year: number;
  privacyHref?: string | null;
  /** Extra entry next to the privacy link, e.g. a FooterLinkButton that reopens the cookie settings. */
  legalExtra?: ReactNode;
  socialLinks?: SocialLink[];
  labels?: Partial<FooterLabels>;
};

/** Site footer: contact column, link columns, copyright with legal links and social media links. */
export const Footer: FC<Props> = ({
  contact,
  navigation,
  copyrightHolder,
  year,
  privacyHref,
  legalExtra,
  socialLinks = [],
  labels: labelOverrides,
}) => {
  const labels = { ...DEFAULT_LABELS, ...labelOverrides };

  return (
    <footer className="surface-dark bg-wehrli text-white/90" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        {labels.heading}
      </h2>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
          <div className="shrink-0 lg:w-64 xl:w-72">
            <FooterContact {...contact} />
          </div>

          {navigation.length > 0 && (
            <div className="min-w-0 flex-1 border-t border-white/10 pt-6 lg:border-t-0 lg:pt-0">
              <FooterNavigation sections={navigation} />
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
            <p className={FOOTER_BODY_TEXT_CLASS}>
              &copy; {year} {copyrightHolder}. {labels.rightsReserved}
            </p>
            {privacyHref && (
              <Link href={privacyHref} className={FOOTER_LINK_CLASS}>
                {labels.privacy}
              </Link>
            )}
            {legalExtra}
          </div>

          {socialLinks.length > 0 && (
            <ul className="flex gap-4" aria-label={labels.socialMedia}>
              {socialLinks.map(({ network, href }) => (
                <li key={network}>
                  <Link
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    prefetch={false}
                    className={`${FOOTER_LINK_CLASS} p-1.5`}
                  >
                    <span className="sr-only">{SOCIAL_NETWORK_NAMES[network]}</span>
                    <SocialIcon network={network} />
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

type FooterLinkButtonProps = {
  children: ReactNode;
  onClick: () => void;
};

/** A button styled like the footer links, e.g. «Cookie-Einstellungen». Render it from a client component. */
export const FooterLinkButton: FC<FooterLinkButtonProps> = ({ children, onClick }) => (
  <button type="button" className={`${FOOTER_LINK_CLASS} text-left`} onClick={onClick}>
    {children}
  </button>
);
