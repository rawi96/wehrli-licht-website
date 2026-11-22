import { ProjectCards } from '@/components/projects/project-cards';
import { ProjectsOverview } from '@/components/projects/projects-overview';
import { filterProjects, getProjectAreaPath, PROJECTS_PATH } from '@/domain/content/project';
import { ProjectsBlockFragment, ProjectsOverviewBlockFragment } from '@/graphql/generated';
import { CtaLink, Heading, Section } from '@wehrli/design-system';
import { FC } from 'react';
import { getRequestProjectAreas, getRequestProjects } from '../projects';

const MAX_PROJECTS = 3;

/** Projects of an area or a service page; the featured projects when nothing matches. Renders nothing without projects. */
export const ProjectsBlock: FC<{ block: ProjectsBlockFragment }> = async ({ block }) => {
  const projects = await getRequestProjects();
  const matching = filterProjects(projects, { areaId: block.area?.id, serviceId: block.service?.id });
  const shown = (matching.length > 0 ? matching : projects.filter(({ featured }) => featured)).slice(0, MAX_PROJECTS);

  if (shown.length === 0) {
    return null;
  }

  const moreHref = block.area && matching.length > MAX_PROJECTS ? getProjectAreaPath(block.area.slug) : PROJECTS_PATH;

  return (
    <Section>
      <Heading level="2">{block.projectsTitle?.trim() ? block.projectsTitle.trim() : 'Projekte zu diesem Thema'}</Heading>
      <ProjectCards projects={shown} />
      <CtaLink href={moreHref}>Alle Projekte ansehen</CtaLink>
    </Section>
  );
};

/** All projects with a filter by area. */
export const ProjectsOverviewBlock: FC<{ block: ProjectsOverviewBlockFragment }> = async ({ block }) => {
  const [projects, areas] = await Promise.all([getRequestProjects(), getRequestProjectAreas()]);

  return <ProjectsOverview projects={projects} areas={areas} allLabel={block.allLabel} />;
};
