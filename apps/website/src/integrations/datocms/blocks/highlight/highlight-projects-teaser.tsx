import { getProjectPath } from '@/domain/content/project';
import { HighlightProjectsTeaserFragment } from '@/graphql/generated';
import { toImage } from '../../image';
import { getCmsLinkHref, toLink } from '../../links';
import { highlightLinkedImage } from './highlight-teaser';
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
    cta={block.primaryCta && toLink(block.primaryCta)}
    priority={aboveFold}
    projects={block.projects.map((project) => ({
      id: project.id,
      offer: project.offer,
      title: project.title,
      company: project.company,
      description: project.description,
      // The project record if set (its page and picture), else the link to a page.
      href: project.project
        ? getProjectPath(project.project.slug)
        : project.projectLink && getCmsLinkHref(project.projectLink),
      image: project.project
        ? toImage(project.project.teaserImage, { fallbackAlt: `${project.title} – ${project.company}` })
        : highlightLinkedImage(project.projectLink, `${project.title} – ${project.company}`),
    }))}
  />
);
