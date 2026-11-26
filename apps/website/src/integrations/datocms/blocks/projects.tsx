import { ProjectCards } from '@/components/projects/project-cards';
import { ProjectsOverview } from '@/components/projects/projects-overview';
import { filterProjects, getProjectAreaPath, PROJECTS_PATH } from '@/domain/content/project';
import { ProjectsBlockFragment, ProjectsOverviewBlockFragment } from '@/graphql/generated';
import { SectionHeading, Section } from '@wehrli/design-system';
import { FC } from 'react';
import { getActiveProjectArea } from '../active-project-area';
import { getRequestProjectAreas, getRequestProjects } from '../projects';
import { getSiteTexts } from '../site-texts';

/** Fills one row of the 4-column card grid. */
const MAX_PROJECTS = 4;

type Props = {
  block: ProjectsBlockFragment;
};

/**
 * Projects of an area or a service page, topped up with the featured and then the other projects so the row is full.
 * Renders nothing without projects.
 */
export const ProjectsBlock: FC<Props> = async ({ block }) => {
  const [projects, texts] = await Promise.all([getRequestProjects(), getSiteTexts()]);
  // Without area and service, the block shows the featured projects (as its hint in DatoCMS says).
  const matching =
    block.area || block.service ? filterProjects(projects, { areaId: block.area?.id, serviceId: block.service?.id }) : [];
  const featuredFirst = [
    ...projects.filter((project) => project.featured),
    ...projects.filter((project) => !project.featured),
  ];
  const matchingIds = new Set(matching.map((project) => project.id));
  // The matching projects first, then featured and other projects, so the row is always full.
  const shown = [...matching, ...featuredFirst.filter((project) => !matchingIds.has(project.id))].slice(0, MAX_PROJECTS);

  if (shown.length === 0) {
    return null;
  }

  const moreHref = block.area && matching.length > MAX_PROJECTS ? getProjectAreaPath(block.area.slug) : PROJECTS_PATH;

  return (
    <Section>
      <SectionHeading
        title={block.projectsTitle?.trim() ? block.projectsTitle.trim() : texts.projectsBlockTitle}
        link={{ label: texts.projectsAllLink, href: moreHref }}
      />
      <ProjectCards projects={shown} linkLabel={texts.projectsCardLink} />
    </Section>
  );
};

/** All projects with a chip per area; on an area page (/projekte/<slug>) with that area's chip active. */
export const ProjectsOverviewBlock: FC<{ block: ProjectsOverviewBlockFragment }> = async ({ block }) => {
  const [projects, areas, texts] = await Promise.all([getRequestProjects(), getRequestProjectAreas(), getSiteTexts()]);

  return (
    <ProjectsOverview
      projects={projects}
      areas={areas}
      activeArea={getActiveProjectArea()}
      allLabel={block.allLabel}
      cardLinkLabel={texts.projectsCardLink}
    />
  );
};
