import { ProjectCards } from '@/components/projects/project-cards';
import { ProjectsOverview } from '@/components/projects/projects-overview';
import { filterProjects, getProjectAreaPath, PROJECTS_PATH } from '@/domain/content/project';
import { ProjectsBlockFragment, ProjectsOverviewBlockFragment } from '@/graphql/generated';
import { CtaLink, Heading, Section } from '@wehrli/design-system';
import { FC } from 'react';
import { getActiveProjectArea } from '../active-project-area';
import { getRequestProjectAreas, getRequestProjects } from '../projects';
import { getSiteTexts } from '../site-texts';

const MAX_PROJECTS = 3;

/** Projects of an area or a service page; the featured projects when nothing matches. Renders nothing without projects. */
export const ProjectsBlock: FC<{ block: ProjectsBlockFragment }> = async ({ block }) => {
  const [projects, texts] = await Promise.all([getRequestProjects(), getSiteTexts()]);
  // Without area and service, the block shows the featured projects (as its hint in DatoCMS says).
  const matching =
    block.area || block.service ? filterProjects(projects, { areaId: block.area?.id, serviceId: block.service?.id }) : [];
  const shown = (matching.length > 0 ? matching : projects.filter(({ featured }) => featured)).slice(0, MAX_PROJECTS);

  if (shown.length === 0) {
    return null;
  }

  const moreHref = block.area && matching.length > MAX_PROJECTS ? getProjectAreaPath(block.area.slug) : PROJECTS_PATH;

  return (
    <Section>
      <Heading level="2">{block.projectsTitle?.trim() ? block.projectsTitle.trim() : texts.projectsBlockTitle}</Heading>
      <ProjectCards projects={shown} linkLabel={texts.projectsCardLink} />
      <CtaLink href={moreHref}>{texts.projectsAllLink}</CtaLink>
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
