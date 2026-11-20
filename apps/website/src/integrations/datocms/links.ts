import { LinkBlockFragment } from '@/graphql/generated';
import { generatePathForRecord } from './paths';
import type { LinkData } from '@wehrli/design-system';

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

/** A CMS link block as the design system's LinkData (label, href, new-tab flag). */
export const toLink = (link: LinkBlockFragment): LinkData => ({
  label: link.label,
  href: getCmsLinkHref(link),
  newTab: link.newTab,
});
