import { HeaderFooterRecord } from '@/graphql/generated';

export type FooterNavLink = {
  name: string;
  href: string;
};

export type FooterNavSection = {
  title: string;
  links: FooterNavLink[];
};

export const mapFooterNavigationFromDato = (headerFooter: HeaderFooterRecord): FooterNavSection[] =>
  headerFooter.footerNavigation.flatMap((group) => {
    const links = group.links
      .map((link) => ({
        name: link.label.trim(),
        href: link.href.trim(),
      }))
      .filter((link) => link.name && link.href);

    const title = group.title.trim();
    if (!title || links.length === 0) {
      return [];
    }

    return [{ title, links }];
  });
