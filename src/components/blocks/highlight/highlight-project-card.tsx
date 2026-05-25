import { ImageComponent } from '@/components/image';
import { HighlightProjectItemFragment } from '@/graphql/generated';
import { getCmsLinkHref } from '@/utils/cms-link';
import { HIGHLIGHT_IMAGE_SIZES, getHighlightLinkedTeaserImage, highlightImageAlt } from '@/utils/highlight-teaser';
import { classNames } from '@/utils/css';
import Link from 'next/link';
import { FC } from 'react';

const PROJECT_CTA_LABEL = 'Projekt ansehen';

const cardLinkClass = classNames(
  'shadow-sm ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-md',
  'active:scale-[0.99] motion-reduce:active:scale-100',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wehrli focus-visible:ring-offset-2',
);

type CardContentProps = {
  project: HighlightProjectItemFragment;
  compact?: boolean;
};

const CardContent: FC<CardContentProps> = ({ project, compact }) => (
  <>
    <p className="text-wehrli-400 text-xxs font-bold tracking-[0.18em] uppercase sm:tracking-[0.22em]">{project.offer}</p>
    <h3
      className={classNames(
        'text-wehrli mt-2 leading-snug font-bold text-balance',
        compact ? 'text-base sm:text-lg' : 'mt-2.5 text-lg sm:mt-3 sm:text-xl',
      )}
    >
      {project.title}
    </h3>
    <p className="mt-1.5 text-sm font-bold text-black/70 sm:mt-2">{project.company}</p>
    <p
      className={classNames(
        'mt-2.5 text-sm leading-relaxed text-pretty text-gray-700 sm:mt-3',
        compact ? 'flex-1' : 'max-w-sm',
      )}
    >
      {project.description}
    </p>
    <span
      className={classNames(
        'text-wehrli/80 group-hover:text-wehrli mt-4 inline-block text-sm font-bold transition-colors group-hover:underline group-hover:underline-offset-4 sm:mt-5',
        compact && 'mt-4',
      )}
    >
      {PROJECT_CTA_LABEL}
    </span>
  </>
);

type FeaturedProps = {
  project: HighlightProjectItemFragment;
  priority?: boolean;
};

export const HighlightProjectFeaturedCard: FC<FeaturedProps> = ({ project, priority }) => {
  if (!project.projectLink) {
    return null;
  }

  const teaserImage = getHighlightLinkedTeaserImage(project.projectLink);
  const imageAlt = highlightImageAlt(teaserImage?.alt, `${project.title} – ${project.company}`);

  return (
    <Link
      href={getCmsLinkHref(project.projectLink)}
      className={classNames(
        'group bg-white-100 grid w-full grid-cols-1 overflow-hidden rounded no-underline',
        cardLinkClass,
        'lg:min-h-[18rem] lg:grid-cols-12',
      )}
    >
      <div className="relative aspect-[16/11] min-h-[11rem] overflow-hidden sm:min-h-[13rem] lg:col-span-7 lg:aspect-auto lg:min-h-full">
        <ImageComponent
          image={teaserImage ? { ...teaserImage, alt: imageAlt } : null}
          priority={priority}
          sizes={HIGHLIGHT_IMAGE_SIZES.projectFeatured}
          imgClassName="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
        />
      </div>
      <div className="flex flex-col justify-center p-5 sm:p-6 lg:col-span-5 lg:p-8">
        <CardContent project={project} />
      </div>
    </Link>
  );
};

type CompactProps = {
  project: HighlightProjectItemFragment;
};

export const HighlightProjectCompactCard: FC<CompactProps> = ({ project }) => {
  if (!project.projectLink) {
    return null;
  }

  const teaserImage = getHighlightLinkedTeaserImage(project.projectLink);
  const imageAlt = highlightImageAlt(teaserImage?.alt, `${project.title} – ${project.company}`);

  return (
    <Link
      href={getCmsLinkHref(project.projectLink)}
      className={classNames('group bg-white-100 flex h-full flex-col overflow-hidden rounded no-underline', cardLinkClass)}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <ImageComponent
          image={teaserImage ? { ...teaserImage, alt: imageAlt } : null}
          sizes={HIGHLIGHT_IMAGE_SIZES.projectCompact}
          imgClassName="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
        />
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <CardContent project={project} compact />
      </div>
    </Link>
  );
};
