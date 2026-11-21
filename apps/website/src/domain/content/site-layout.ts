/** A link of the site navigation. */
export type MenuLink = {
  label: string;
  href: string;
};

/** A titled group of links in a mega menu section. */
export type MenuColumn = {
  title: string;
  /** Overview page of the group, linked from the title; null if the title is plain text. */
  href: string | null;
  links: MenuLink[];
};

/** An entry of the main navigation: a link, a section with sub pages (`children`) or a mega menu (`columns`). */
export type MenuItem = MenuLink & {
  /** Sub pages of a section; `href` is then the section's path (to mark it active), not a link. */
  children?: MenuLink[];
  /** Titled groups of links of a mega menu section; `href` is its overview page. */
  columns?: MenuColumn[];
  /** Links below the columns of a mega menu section. */
  footerLinks?: MenuLink[];
};

/** A group of links in the footer. */
export type FooterLinkGroup = {
  title: string;
  links: MenuLink[];
};

/** A notice in the footer (opening hours, holidays): a title and trusted HTML. */
export type SiteNotice = {
  title: string;
  html: string;
};

/** The business's contact data, shown in the footer and used for structured data. */
export type SiteContact = {
  companyName: string | null;
  street: string | null;
  zip: string | null;
  place: string | null;
  phone: string | null;
  email: string | null;
  mapsHref: string | null;
};

export type SocialProfiles = {
  linkedin: string | null;
  instagram: string | null;
  facebook: string | null;
};

/** Everything around the page content: navigation, contact data and footer. */
export type SiteLayout = {
  /** Main navigation without the shop and the contact entry (the header adds those itself). */
  navigation: MenuItem[];
  /** The contact entry of the main navigation, shown as a button in the header. */
  contactLink: MenuLink | null;
  /** The shop as a mega menu, set apart on the right of the header; null: the header links /shop. */
  shopMenu: MenuItem | null;
  contact: SiteContact;
  socialProfiles: SocialProfiles;
  /** Null when none is set or the holiday notice is switched off. */
  holidayNotice: SiteNotice | null;
  openingHours: SiteNotice | null;
  footerNavigation: FooterLinkGroup[];
  /** Path of the privacy policy, or null if none is set. */
  privacyPath: string | null;
  /** Path of the contact page, with a fallback when none is set. */
  contactPath: string;
};
