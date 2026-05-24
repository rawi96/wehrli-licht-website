import { CmsLinkButton } from '@/components/cms/cms-link-button';
import { HighlightProjectsTeaserFragment } from '@/graphql/generated';
import { FC } from 'react';
import { HighlightProjectCompactCard, HighlightProjectFeaturedCard } from './highlight-project-card';
import { HighlightTeaserSection } from './highlight-teaser-section';

type Props = {
  block: HighlightProjectsTeaserFragment;
};

export const HighlightProjectsTeaserBlock: FC<Props> = ({ block }) => {
  const { title, subline, primaryCta, projects, disableMarginTop, disableMarginBottom } = block;
  const [featuredProject, ...gridProjects] = projects;

  if (projects.length === 0 || !primaryCta) {
    return null;
  }

  return (
    <HighlightTeaserSection
      blockId={block.id}
      title={title}
      subline={subline}
      disableMarginTop={disableMarginTop}
      disableMarginBottom={disableMarginBottom}
      footer={<CmsLinkButton link={primaryCta} type="primary" fullWidth />}
    >
      <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10">
        {featuredProject && <HighlightProjectFeaturedCard project={featuredProject} priority />}
        {gridProjects.length > 0 && (
          <ul className="grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
            {gridProjects.map((project) => (
              <li key={project.id}>
                <HighlightProjectCompactCard project={project} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </HighlightTeaserSection>
  );
};
