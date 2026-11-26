import { getProjectAreaPath, PROJECTS_PATH, type ProjectArea, type ProjectSummary } from '@/domain/content/project';
import { FilterChips, RichText } from '@wehrli/design-system';
import { FC } from 'react';
import { ProjectCards } from './project-cards';

type Props = {
  projects: ProjectSummary[];
  areas: ProjectArea[];
  /** The area whose page this is (/projekte/<slug>), null on the page with all projects. */
  activeArea: ProjectArea | null;
  allLabel?: string | null;
  /** Link text of each project card. */
  cardLinkLabel: string;
};

/** All projects with a chip per area; each area has its own page with the same overview and its chip active. */
export const ProjectsOverview: FC<Props> = ({ projects, areas, activeArea, allLabel, cardLinkLabel }) => {
  const visible = activeArea ? projects.filter((project) => project.area?.id === activeArea.id) : projects;

  return (
    <section className="mt-12 flex flex-col gap-8">
      {areas.length > 1 && (
        <FilterChips
          label="Projekte nach Bereich"
          all={{ label: allLabel?.trim() ? allLabel.trim() : 'Alle', href: PROJECTS_PATH }}
          value={activeArea?.id ?? null}
          options={areas.map((area) => ({
            id: area.id,
            label: area.name,
            href: getProjectAreaPath(area.slug),
            count: projects.filter((project) => project.area?.id === area.id).length,
          }))}
        />
      )}
      {activeArea?.intro && (
        <RichText>
          <p>{activeArea.intro}</p>
        </RichText>
      )}
      {/* The overview has no section heading: the project titles come right after the page title. */}
      <ProjectCards projects={visible} linkLabel={cardLinkLabel} headingLevel="h2" />
    </section>
  );
};
