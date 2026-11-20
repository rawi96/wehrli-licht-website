import type { ShopLink } from '@wehrli/design-system';
import { LinkBlockFragment } from '@/graphql/generated';
import { generatePathForRecord } from '@/utils/pathnames';

export const getShopLinkHref = (link: LinkBlockFragment): string => {
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

/** A CMS link block as the design system's ShopLink. */
export const toShopLink = (link: LinkBlockFragment): ShopLink => ({
  href: getShopLinkHref(link),
  label: link.label,
  newTab: link.newTab,
});
