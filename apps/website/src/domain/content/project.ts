import type { ResponsiveImage } from '../shop/image';
import type { Breadcrumb } from './page';

/** A field of projects, e.g. Gastronomie or Büro, with its own overview page. */
export type ProjectArea = {
  id: string;
  name: string;
  slug: string;
  intro: string | null;
  image: ResponsiveImage | null;
  lastModified?: string;
  /** Hidden from search engines (sitemap, robots, llms.txt). */
  noIndex?: boolean;
};

/** A link to a service page a project belongs to. */
export type ProjectService = {
  id: string;
  title: string;
  href: string;
};

/** A reference project as shown in lists and in its facts box. */
export type ProjectSummary = {
  id: string;
  title: string;
  slug: string;
  client: string | null;
  location: string | null;
  year: string | null;
  featured: boolean;
  description: string | null;
  image: ResponsiveImage | null;
  area: { id: string; name: string; slug: string } | null;
  services: ProjectService[];
  lastModified?: string;
  /** Hidden from search engines (sitemap, robots, llms.txt). */
  noIndex?: boolean;
};

/** URLs of the projects section. */
export const PROJECTS_PATH = '/projekte';
export const getProjectPath = (slug: string): string => `${PROJECTS_PATH}/${slug}`;
export const getProjectAreaPath = (slug: string): string => `${PROJECTS_PATH}/${slug}`;

/** Projects of an area or a service page; featured projects first, as delivered. */
export const filterProjects = (
  projects: ProjectSummary[],
  { areaId, serviceId }: { areaId?: string | null; serviceId?: string | null },
): ProjectSummary[] =>
  projects.filter(
    (project) =>
      (!areaId || project.area?.id === areaId) &&
      (!serviceId || project.services.some((service) => service.id === serviceId)),
  );

/** Projects in the same area first, then the others; without the project itself. */
export const relatedProjects = (projects: ProjectSummary[], project: ProjectSummary, limit = 3): ProjectSummary[] => {
  const others = projects.filter(({ id }) => id !== project.id);

  return [
    ...others.filter(({ area }) => area?.id === project.area?.id),
    ...others.filter(({ area }) => area?.id !== project.area?.id),
  ].slice(0, limit);
};

/** Projekte › area › project (the project's own step only when given). */
export const projectBreadcrumbs = (
  area: { name: string; slug: string } | null,
  project?: { title: string; slug: string },
): Breadcrumb[] => [
  { name: 'Projekte', href: PROJECTS_PATH },
  ...(area ? [{ name: area.name, href: getProjectAreaPath(area.slug) }] : []),
  ...(project ? [{ name: project.title, href: getProjectPath(project.slug) }] : []),
];
