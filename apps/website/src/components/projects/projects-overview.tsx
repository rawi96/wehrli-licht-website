'use client';

import type { ProjectArea, ProjectSummary } from '@/domain/content/project';
import { FilterChips } from '@wehrli/design-system';
import { FC, useState } from 'react';
import { ProjectCards } from './project-cards';

type Props = {
  projects: ProjectSummary[];
  areas: ProjectArea[];
  allLabel?: string | null;
};

/** All projects with a filter by area. */
export const ProjectsOverview: FC<Props> = ({ projects, areas, allLabel }) => {
  const [areaId, setAreaId] = useState<string | null>(null);
  const visible = areaId ? projects.filter((project) => project.area?.id === areaId) : projects;

  return (
    <section className="mt-12">
      {areas.length > 1 && (
        <FilterChips
          label="Projekte nach Bereich"
          allLabel={allLabel?.trim() ? allLabel.trim() : 'Alle'}
          value={areaId}
          onChange={setAreaId}
          options={areas.map((area) => ({
            id: area.id,
            label: area.name,
            count: projects.filter((project) => project.area?.id === area.id).length,
          }))}
        />
      )}
      <ProjectCards projects={visible} />
    </section>
  );
};
