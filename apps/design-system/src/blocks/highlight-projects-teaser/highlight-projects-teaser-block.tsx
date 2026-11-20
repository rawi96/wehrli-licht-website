import { FC } from 'react';
import { HighlightProjectCard } from '../../content/highlight-project-card/highlight-project-card';
import { HighlightSection } from '../../content/highlight-section/highlight-section';
import { LinkData } from '../../typography/text-link/text-link';
import { ImageData } from '../../content/image/image';

type Project = {
  id: string;
  offer?: string | null;
  title: string;
  company?: string | null;
  description?: string | null;
  /** Without a link the project is left out (its grid cell stays empty). */
  href?: string | null;
  image?: ImageData | null;
};

type Props = {
  /** Unique id of the block, for the heading id. */
  id: string;
  title: string;
  subline: string;
  cta?: LinkData | null;
  /** The first project is the large featured card, the others form a grid of 1–3 columns. */
  projects: Project[];
  /** Loads the image of the featured project with priority (LCP). */
  priority?: boolean;
};

/** Full-width band with reference projects. Renders nothing without projects or call to action. */
export const HighlightProjectsTeaserBlock: FC<Props> = ({ id, title, subline, cta, projects, priority }) => {
  const [featuredProject, ...gridProjects] = projects;

  if (projects.length === 0 || !cta) {
    return null;
  }

  return (
    <HighlightSection id={id} title={title} subline={subline} cta={cta}>
      <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10">
        {featuredProject?.href && (
          <HighlightProjectCard variant="featured" {...featuredProject} href={featuredProject.href} priority={priority} />
        )}
        {gridProjects.length > 0 && (
          <ul className="grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
            {gridProjects.map((project) => (
              <li key={project.id}>
                {project.href && <HighlightProjectCard variant="compact" {...project} href={project.href} />}
              </li>
            ))}
          </ul>
        )}
      </div>
    </HighlightSection>
  );
};
