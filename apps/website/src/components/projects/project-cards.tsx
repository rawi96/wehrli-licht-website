import type { ProjectSummary } from '@/domain/content/project';
import { getProjectPath } from '@/domain/content/project';
import { cn, CARD_COLUMNS, GRID_COLUMN_CLASSES, gridImageSizes, ProjectTile } from '@wehrli/design-system';
import { FC } from 'react';

type Props = {
  projects: ProjectSummary[];
  /** Link text of each tile, e.g. «Projekt ansehen». */
  linkLabel: string;
  /** `h2` where no section heading sits above the tiles. */
  headingLevel?: 'h2' | 'h3';
};

/** Area and place, e.g. «Gastronomie · Mörschwil». */
export const toProjectEyebrow = ({ area, location }: ProjectSummary): string | null =>
  [area?.name, location].filter(Boolean).join(' · ') || null;

/** Projects as picture tiles (area and place, title, short description), unlike the white page teasers. */
export const ProjectCards: FC<Props> = ({ projects, linkLabel, headingLevel }) => (
  <div className={cn('grid grid-cols-1 gap-4 lg:gap-6', GRID_COLUMN_CLASSES[CARD_COLUMNS])}>
    {projects.map((project) => (
      <ProjectTile
        key={project.id}
        title={project.title}
        description={project.description}
        eyebrow={toProjectEyebrow(project)}
        href={getProjectPath(project.slug)}
        linkLabel={linkLabel}
        image={project.image}
        imageSizes={gridImageSizes()}
        headingLevel={headingLevel}
      />
    ))}
  </div>
);
