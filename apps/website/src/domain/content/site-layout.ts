/** A link of the site navigation. */
export type MenuLink = {
  label: string;
  href: string;
};

/** An entry of the main navigation: a link, or a section with sub pages (`children`). */
export type MenuItem = MenuLink & {
  /** Sub pages of a section; `href` is then the section's path (to mark it active), not a link. */
  children?: MenuLink[];
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
