import { CmsHtml } from '@/components/cms-html';
import { CookieSettingsButton } from '@/components/analytics/cookie-banner';
import { SITE_NAME } from '@/lib/site';
import type { SiteLayout, SiteNotice, SocialProfiles } from '@/domain/content/site-layout';
import { analytics } from '@/integrations/client';
import { FooterNotice, Footer as FooterLayout, SocialLink } from '@wehrli/design-system';
import { FC } from 'react';

type Props = {
  layout: SiteLayout;
  /** Text after the copyright, e.g. «Alle Rechte vorbehalten.» (CMS). */
  rightsReserved: string;
};

const SOCIAL_NETWORKS: (SocialLink['network'] & keyof SocialProfiles)[] = ['linkedin', 'instagram', 'facebook'];

/** Opening hours and holiday texts are HTML from the CMS. */
const toNotice = (notice: SiteNotice | null): FooterNotice | null =>
  notice && { title: notice.title, text: <CmsHtml html={notice.html} as="div" /> };

export const Footer: FC<Props> = ({ layout, rightsReserved }) => {
  const { contact, socialProfiles } = layout;
  const socialLinks: SocialLink[] = SOCIAL_NETWORKS.flatMap((network) => {
    const href = socialProfiles[network];

    return href ? [{ network, href }] : [];
  });

  return (
    <FooterLayout
      contact={{
        ...contact,
        holiday: toNotice(layout.holidayNotice),
        openingHours: toNotice(layout.openingHours),
      }}
      navigation={layout.footerNavigation}
      copyrightHolder={contact.companyName ?? SITE_NAME}
      year={new Date().getFullYear()}
      privacyHref={layout.privacyPath}
      legalExtra={analytics.isEnabled && <CookieSettingsButton />}
      socialLinks={socialLinks}
      labels={{ rightsReserved }}
    />
  );
};
