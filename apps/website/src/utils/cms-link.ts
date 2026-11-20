import { LinkBlockFragment } from '@/graphql/generated';
import { generatePathForRecord } from '@/utils/pathnames';
import type { HighlightLink } from '@wehrli/design-system';

export const getCmsLinkHref = (link: LinkBlockFragment): string => {
  if (link.isExternalUrl && link.externalUrl) {
    return link.externalUrl;
  }

  if (link.link?.slug) {
    const base = generatePathForRecord({
      slug: link.link.slug,
      type: 'PageRecord',
      parent: link.link.parent,
    });

    return `${base}${link.anchorLink ?? ''}`;
  }

  return link.anchorLink ?? '#';
};

/** A CMS link block as label, href and new-tab flag, e.g. for the calls to action of the highlight teasers. */
export const toCmsLink = (link: LinkBlockFragment): HighlightLink => ({
  label: link.label,
  href: getCmsLinkHref(link),
  newTab: link.newTab,
});
