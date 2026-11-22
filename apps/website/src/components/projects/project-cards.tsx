import type { ProjectSummary } from '@/domain/content/project';
import { getProjectPath } from '@/domain/content/project';
import { Card, Grid, gridImageSizes } from '@wehrli/design-system';
import { FC } from 'react';

type Props = {
  projects: ProjectSummary[];
};

const toEyebrow = ({ area, location }: ProjectSummary): string | null =>
  [area?.name, location].filter(Boolean).join(' · ') || null;

/** Projects as cards: area and place, title, short description. */
export const ProjectCards: FC<Props> = ({ projects }) => (
  <Grid cols={projects.length}>
    {projects.map((project) => (
      <Card
        key={project.id}
        title={project.title}
        description={project.description}
        eyebrow={toEyebrow(project)}
        href={getProjectPath(project.slug)}
        linkLabel="Projekt ansehen"
        prefetch={false}
        image={project.image}
        imageSizes={gridImageSizes(projects.length)}
      />
    ))}
  </Grid>
);
