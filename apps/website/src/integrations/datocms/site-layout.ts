import 'server-only';
import { CompanyProfileDocument, HeaderFooterDocument, HeaderFooterQuery } from '@/graphql/generated';
import type { CompanyProfile } from '@/domain/content/company-profile';
import type { FooterLinkGroup, MenuItem, MenuLink, SiteLayout, SiteNotice } from '@/domain/content/site-layout';
import { cache } from 'react';
import { queryDatoCMS } from './client';
import { isDraftMode } from './draft';
import { getShopCategoryPath } from '@/domain/shop/paths';
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

type MainMenuSection = HeaderFooter['mainMenu'][number];
type MainMenuLink = MainMenuSection['footerLinks'][number];

/** Target of a menu link: a page wins over a shop category, a category over a path. Null if none is set. */
const toMenuLinkHref = (link: {
  page?: MainMenuLink['page'];
  shopCategory?: MainMenuLink['shopCategory'];
  path?: string | null;
}): string | null =>
  getCmsPagePath(link.page) ??
  (link.shopCategory?.slug ? getShopCategoryPath(link.shopCategory.slug) : null) ??
  (hasText(link.path) ? link.path.trim() : null);

const toMenuLinks = (links: MainMenuLink[]): MenuLink[] =>
  links.flatMap((link) => {
    const href = toMenuLinkHref(link);

    return href && hasText(link.label) ? [{ label: link.label.trim(), href }] : [];
  });

type MainMenuColumn = MainMenuSection['columns'][number];

/** The link below a column's links («Alle Leistungen»): needs a text and a page or path. */
const toColumnOverview = (column: MainMenuColumn): MenuLink | null => {
  const href = toMenuLinkHref({ page: column.page, path: column.overviewPath });

  return href && hasText(column.overviewLabel) ? { label: column.overviewLabel.trim(), href } : null;
};

/** A section of the new main menu: a mega menu with columns, or a plain link without. */
const toMainMenuItem = (section: MainMenuSection): MenuItem | null => {
  const href = toMenuLinkHref(section);
  const columns = section.columns
    .map((column) => ({
      title: column.title.trim(),
      links: toMenuLinks(column.links),
      overview: toColumnOverview(column),
    }))
    .filter((column) => column.title && column.links.length > 0);

  if (!href && columns.length === 0) {
    return null;
  }

  return {
    label: section.label,
    href: href ?? '/',
    ...(columns.length > 0 && { columns, footerLinks: toMenuLinks(section.footerLinks) }),
  };
};

/** The appointment button of the header, null if not set. */
const toAppointmentLink = (headerFooter: HeaderFooter): MenuLink | null => {
  const href = getCmsPagePath(headerFooter.appointmentPage);

  return href && hasText(headerFooter.appointmentLabel) ? { label: headerFooter.appointmentLabel.trim(), href } : null;
};

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

/**
 * Navigation from «Hauptmenü» (mega menu) when it has entries, otherwise from the old «Menü»: the old one stays usable
 * until the new menu is maintained.
 */
const toNavigation = (headerFooter: HeaderFooter): Pick<SiteLayout, 'navigation' | 'contactLink' | 'shopMenu'> => {
  if (headerFooter.mainMenu.length > 0) {
    const sections = headerFooter.mainMenu.flatMap((section) => {
      const item = toMainMenuItem(section);

      return item ? [{ item, isShop: section.isShop }] : [];
    });

    return {
      navigation: sections.filter(({ isShop }) => !isShop).map(({ item }) => item),
      shopMenu: sections.find(({ isShop }) => isShop)?.item ?? null,
      contactLink: toAppointmentLink(headerFooter) ?? toContactLink(headerFooter.menu),
    };
  }

  return {
    navigation: headerFooter.menu
      .filter((item) => !isMenuLinkTo(item, 'shop') && !isMenuLinkTo(item, 'kontakt'))
      .map(toMenuItem),
    shopMenu: null,
    contactLink: toContactLink(headerFooter.menu),
  };
};

const toSiteLayout = (headerFooter: HeaderFooter): SiteLayout => ({
  ...toNavigation(headerFooter),
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
