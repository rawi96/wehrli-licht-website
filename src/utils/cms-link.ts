import { LinkBlockFragment } from '@/graphql/generated';
import { PageRecord, generatePathForRecord } from '@/utils/pathnames';

export const getCmsLinkHref = (link: LinkBlockFragment): string => {
  if (link.isExternalUrl && link.externalUrl) {
    return link.externalUrl;
  }

  if (link.link?.slug) {
    const base = generatePathForRecord({
      slug: link.link.slug,
      type: 'PageRecord',
      parent: link.link.parent as PageRecord | null | undefined,
    });

    return `${base}${link.anchorLink ?? ''}`;
  }

  return link.anchorLink ?? '#';
};
