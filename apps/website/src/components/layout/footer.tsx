import { CmsHtml } from '@/components/cms-html';
import { CookieSettingsButton } from '@/components/analytics/cookie-banner';
import { SITE_NAME } from '@/constants/site';
import { HeaderFooterRecord } from '@/graphql/generated';
import { analytics } from '@/integrations/client';
import { getCmsPagePath } from '@/utils/cms-page-path';
import { mapFooterNavigationFromDato } from '@/utils/map-footer-navigation';
import { FooterNotice, Footer as FooterLayout, SocialLink } from '@wehrli/design-system';
import { FC } from 'react';

type Props = {
  headerFooter: HeaderFooterRecord;
};

const SOCIAL_LINKS: { network: SocialLink['network']; key: keyof HeaderFooterRecord }[] = [
  { network: 'linkedin', key: 'linkedinUrl' },
  { network: 'instagram', key: 'instagramUrl' },
  { network: 'facebook', key: 'facebookUrl' },
];

const hasText = (value?: string | null): value is string => Boolean(value?.trim());

/** Opening hours and holiday texts are HTML from DatoCMS. */
const toNotice = (title?: string | null, html?: string | null): FooterNotice | null =>
  hasText(title) && hasText(html)
    ? {
        title,
        text: <CmsHtml html={html} as="div" />,
      }
    : null;

export const Footer: FC<Props> = ({ headerFooter }) => {
  const socialLinks: SocialLink[] = SOCIAL_LINKS.flatMap(({ network, key }) => {
    const href = headerFooter[key];

    return typeof href === 'string' && href ? [{ network, href }] : [];
  });

  return (
    <FooterLayout
      contact={{
        companyName: headerFooter.companyName,
        street: headerFooter.street,
        zip: headerFooter.zip,
        place: headerFooter.place,
        phone: headerFooter.phone,
        email: headerFooter.email,
        mapsHref: headerFooter.mapsLink,
        holiday: headerFooter.holidayDisable ? null : toNotice(headerFooter.holidayTitle, headerFooter.holidayText),
        openingHours: toNotice(headerFooter.openingHoursTitle, headerFooter.openingHoursText),
      }}
      navigation={mapFooterNavigationFromDato(headerFooter)}
      copyrightHolder={headerFooter.companyName ?? SITE_NAME}
      year={new Date().getFullYear()}
      privacyHref={getCmsPagePath(headerFooter.privacyPage)}
      legalExtra={analytics.isEnabled && <CookieSettingsButton />}
      socialLinks={socialLinks}
    />
  );
};
