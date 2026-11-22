import 'server-only';
import {
  AllProjectAreasDocument,
  AllProjectsDocument,
  ProjectAreaBySlugDocument,
  ProjectAreaFragment,
  ProjectBySlugDocument,
  ProjectSummaryFragment,
} from '@/graphql/generated';
import type { PageMetadata } from '@/domain/content/page';
import type { ProjectArea, ProjectSummary } from '@/domain/content/project';
import { getProjectAreaPath, getProjectPath, PROJECTS_PATH } from '@/domain/content/project';
import { setActiveProjectArea } from './active-project-area';
import { getPage } from './pages';
import type { ProjectPage } from '@/ports/content-source';
import { cache } from 'react';
import { ContentBlocks } from './blocks/content-blocks';
import { queryDatoCMS } from './client';
import { isDraftMode } from './draft';
import { buildDatoPageMetadata } from './metadata';
import { getCmsPagePath } from './paths';

type ResponsiveImageData = NonNullable<NonNullable<ProjectSummaryFragment['teaserImage']>['responsiveImage']>;

const toImage = (image?: ResponsiveImageData | null) => (image?.src ? { ...image, alt: image.alt ?? '' } : null);

const toArea = (area: ProjectAreaFragment): ProjectArea => ({
  id: area.id,
  name: area.name,
  slug: area.slug,
  intro: area.intro?.trim() ? area.intro.trim() : null,
  image: toImage(area.image?.responsiveImage),
  lastModified: area._updatedAt,
});

const toSummary = (project: ProjectSummaryFragment): ProjectSummary => ({
  id: project.id,
  title: project.title,
  slug: project.slug,
  client: project.client ?? null,
  location: project.location ?? null,
  year: project.year ?? null,
  featured: project.featured,
  description: project.teaserDescription ?? null,
  image: toImage(project.teaserImage?.responsiveImage),
  area: project.area ? { id: project.area.id, name: project.area.name, slug: project.area.slug } : null,
  services: project.services.flatMap((service) => {
    const href = getCmsPagePath(service);

    return href ? [{ id: service.id, title: service.title, href }] : [];
  }),
  lastModified: project._updatedAt,
});

const loadProjects = cache(async (includeDrafts: boolean): Promise<ProjectSummary[]> => {
  const { allProjects } = await queryDatoCMS({ document: AllProjectsDocument, includeDrafts });

  return allProjects.map(toSummary);
});

const loadProjectAreas = cache(async (includeDrafts: boolean): Promise<ProjectArea[]> => {
  const [{ allProjectAreas }, projects] = await Promise.all([
    queryDatoCMS({ document: AllProjectAreasDocument, includeDrafts }),
    loadProjects(includeDrafts),
  ]);

  return allProjectAreas.map(toArea).filter((area) => projects.some((project) => project.area?.id === area.id));
});

/** Published projects, featured first, then the newest. Usable outside a request (static params, sitemap). */
export const listProjects = (): Promise<ProjectSummary[]> => loadProjects(false);

/** Published areas that have projects, in their order. Usable outside a request. */
export const listProjectAreas = (): Promise<ProjectArea[]> => loadProjectAreas(false);

/** Projects for the current request: with unpublished ones in draft mode. */
export const getRequestProjects = async (): Promise<ProjectSummary[]> => loadProjects(await isDraftMode());

/** Areas for the current request: with unpublished ones in draft mode. */
export const getRequestProjectAreas = async (): Promise<ProjectArea[]> => loadProjectAreas(await isDraftMode());

const getProjectBySlug = cache(async (slug: string, includeDrafts: boolean) =>
  queryDatoCMS({ document: ProjectBySlugDocument, variables: { slug }, includeDrafts }),
);

const getAreaBySlug = cache(async (slug: string, includeDrafts: boolean) =>
  queryDatoCMS({ document: ProjectAreaBySlugDocument, variables: { slug }, includeDrafts }),
);

/** A project or a project area at /projekte/<slug>, null if there is neither. */
export const getProjectPage = async (slug: string): Promise<ProjectPage | null> => {
  const includeDrafts = await isDraftMode();
  const { project } = await getProjectBySlug(slug, includeDrafts);

  if (project) {
    return {
      kind: 'project',
      project: toSummary(project),
      // The first block (title and lead) comes before the facts box, the rest after it.
      intro: <ContentBlocks blocks={project.content.slice(0, 1)} />,
      content: <ContentBlocks blocks={project.content.slice(1)} eagerBlockCount={0} />,
      projects: await getRequestProjects(),
    };
  }

  const { projectArea } = await getAreaBySlug(slug, includeDrafts);

  if (!projectArea) {
    return null;
  }

  const area = toArea(projectArea);
  const overview = await getPage(PROJECTS_PATH);

  if (!overview) {
    return null;
  }

  // The area page is the overview page (/projekte) with the area's chip active.
  setActiveProjectArea(area);

  return { kind: 'area', area, content: overview.content };
};

export const getProjectPageMetadata = async (slug: string): Promise<PageMetadata> => {
  const includeDrafts = await isDraftMode();
  const { project, site } = await getProjectBySlug(slug, includeDrafts);

  if (project) {
    return buildDatoPageMetadata([...site.favicon, ...project.seo], getProjectPath(slug));
  }

  const { projectArea, site: areaSite } = await getAreaBySlug(slug, includeDrafts);

  return buildDatoPageMetadata([...areaSite.favicon, ...(projectArea?.seo ?? [])], getProjectAreaPath(slug));
};
