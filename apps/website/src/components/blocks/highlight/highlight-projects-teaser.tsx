import { HighlightProjectsTeaserFragment } from '@/graphql/generated';
import { getCmsLinkHref, toCmsLink } from '@/utils/cms-link';
import { highlightLinkedImage } from '@/utils/highlight-teaser';
import { HighlightProjectsTeaserBlock as HighlightProjectsTeaserBlockView } from '@wehrli/design-system';
import { FC } from 'react';

type Props = {
  block: HighlightProjectsTeaserFragment;
  /** Block is near the top of the page: load its lead image eagerly (LCP). */
  aboveFold?: boolean;
};

export const HighlightProjectsTeaserBlock: FC<Props> = ({ block, aboveFold = false }) => (
  <HighlightProjectsTeaserBlockView
    id={block.id}
    title={block.title}
    subline={block.subline}
    cta={block.primaryCta && toCmsLink(block.primaryCta)}
    priority={aboveFold}
    projects={block.projects.map((project) => ({
      id: project.id,
      offer: project.offer,
      title: project.title,
      company: project.company,
      description: project.description,
      href: project.projectLink && getCmsLinkHref(project.projectLink),
      image: highlightLinkedImage(project.projectLink, `${project.title} – ${project.company}`),
    }))}
  />
);
