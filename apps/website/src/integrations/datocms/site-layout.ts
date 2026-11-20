import 'server-only';
import { CompanyProfileDocument, HeaderFooterDocument, HeaderFooterQuery } from '@/graphql/generated';
import type { CompanyProfile } from '@/domain/content/company-profile';
import type { FooterLinkGroup, MenuItem, MenuLink, SiteLayout, SiteNotice } from '@/domain/content/site-layout';
import { cache } from 'react';
import { queryDatoCMS } from './client';
import { isDraftMode } from './draft';
import { getCmsPagePath } from './paths';
import { toLines } from './text';

// The «Header & Footer» singleton always exists.
type HeaderFooter = NonNullable<HeaderFooterQuery['headerFooter']>;
type HeaderMenuItem = HeaderFooter['menu'][number];

/** «Header & Footer» settings, deduplicated per request. */
export const getHeaderFooter = cache(async (includeDrafts: boolean): Promise<HeaderFooter> => {
  const { headerFooter } = await queryDatoCMS({ document: HeaderFooterDocument, includeDrafts });

  return headerFooter!;
});

const normalize = (value: string) => value.trim().toLowerCase();

/** Menu entries named or linked like the shop and the contact page are shown separately in the header. */
const isMenuLinkTo = (item: HeaderMenuItem, name: string): boolean =>
  !('navigationItems' in item) && (normalize(item.label) === name || (item.link?.slug ?? '') === name);

const toMenuItem = (item: HeaderMenuItem): MenuItem =>
  'navigationItems' in item
    ? {
        label: item.label,
        href: `/${item.slug}`,
        children: item.navigationItems.map((child) => ({
          label: child.label,
          href: child.link?.slug ? `/${item.slug}/${child.link.slug}` : '/',
        })),
      }
    : { label: item.label, href: `/${item.link?.slug}` };

/** The last contact entry of the menu, as a link if it links a page. */
const toContactLink = (menu: HeaderMenuItem[]): MenuLink | null => {
  const contact = menu.filter((item) => !isMenuLinkTo(item, 'shop') && isMenuLinkTo(item, 'kontakt')).at(-1);

  return contact && !('navigationItems' in contact) && contact.link?.slug
    ? { label: contact.label, href: `/${contact.link.slug}` }
    : null;
};

const toFooterNavigation = (headerFooter: HeaderFooter): FooterLinkGroup[] =>
  headerFooter.footerNavigation.flatMap((group) => {
    const links = group.links
      .map((link) => ({
        label: link.label.trim(),
        href: link.href.trim(),
      }))
      .filter((link) => link.label && link.href);

    const title = group.title.trim();
    if (!title || links.length === 0) {
      return [];
    }

    return [{ title, links }];
  });

const hasText = (value?: string | null): value is string => Boolean(value?.trim());

/** Opening hours and holiday texts are HTML maintained in DatoCMS. */
const toNotice = (title?: string | null, html?: string | null): SiteNotice | null =>
  hasText(title) && hasText(html) ? { title, html } : null;

/** Used when no contact page is set in Header & Footer. */
const FALLBACK_CONTACT_PATH = '/kontakt';

const toSiteLayout = (headerFooter: HeaderFooter): SiteLayout => ({
  navigation: headerFooter.menu
    .filter((item) => !isMenuLinkTo(item, 'shop') && !isMenuLinkTo(item, 'kontakt'))
    .map(toMenuItem),
  contactLink: toContactLink(headerFooter.menu),
  contact: {
    companyName: headerFooter.companyName ?? null,
    street: headerFooter.street ?? null,
    zip: headerFooter.zip ?? null,
    place: headerFooter.place ?? null,
    phone: headerFooter.phone ?? null,
    email: headerFooter.email ?? null,
    mapsHref: headerFooter.mapsLink ?? null,
  },
  socialProfiles: {
    linkedin: headerFooter.linkedinUrl ?? null,
    instagram: headerFooter.instagramUrl ?? null,
    facebook: headerFooter.facebookUrl ?? null,
  },
  holidayNotice: headerFooter.holidayDisable ? null : toNotice(headerFooter.holidayTitle, headerFooter.holidayText),
  openingHours: toNotice(headerFooter.openingHoursTitle, headerFooter.openingHoursText),
  footerNavigation: toFooterNavigation(headerFooter),
  privacyPath: getCmsPagePath(headerFooter.privacyPage),
  contactPath: getCmsPagePath(headerFooter.contactPage) ?? FALLBACK_CONTACT_PATH,
});

export const getSiteLayout = async (): Promise<SiteLayout> => toSiteLayout(await getHeaderFooter(await isDraftMode()));

export const getContactPath = async (): Promise<string> => {
  try {
    return (await getSiteLayout()).contactPath;
  } catch {
    // The 404 page still renders when DatoCMS is unreachable, with the fallback contact path.
    return FALLBACK_CONTACT_PATH;
  }
};

/** Business facts maintained in DatoCMS («Firmenprofil (SEO & KI)»), deduplicated per request. */
export const getCompanyProfile = cache(async (): Promise<CompanyProfile | null> => {
  const { companyProfile } = await queryDatoCMS({ document: CompanyProfileDocument });

  if (!companyProfile) {
    return null;
  }

  return {
    description: companyProfile.description ?? null,
    llmsIntro: companyProfile.llmsIntro ?? null,
    foundingYear: companyProfile.foundingYear ?? null,
    addressRegion: companyProfile.addressRegion ?? null,
    areaServed: toLines(companyProfile.areaServed),
    expertise: toLines(companyProfile.expertise),
    location: companyProfile.location
      ? { latitude: companyProfile.location.latitude, longitude: companyProfile.location.longitude }
      : null,
  };
});
