import { HeaderFooterRecord } from '@/graphql/generated';
import { FooterNavigationSection } from '@wehrli/design-system';

export const mapFooterNavigationFromDato = (headerFooter: HeaderFooterRecord): FooterNavigationSection[] =>
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
