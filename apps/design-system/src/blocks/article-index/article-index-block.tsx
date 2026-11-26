import { ArrowRightIcon } from '@heroicons/react/20/solid';
import NextLink from 'next/link';
import { FC } from 'react';
import { Image } from '../../content/image/image';
import { Section } from '../../layout/section/section';
import { Heading } from '../../typography/heading/heading';
import type { ChildPage } from '../child-pages/child-pages-block';

type Props = {
  /** The articles in order; the first one is the lead story. */
  articles: ChildPage[];
  /** Heading above the other articles, e.g. «Alle Beiträge». */
  moreTitle: string;
};

const LEAD_SIZES = '(min-width: 1400px) 740px, (min-width: 1024px) 55vw, 92vw';
const GRID_SIZES = '(min-width: 1400px) 410px, (min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw';

const ReadMore: FC<{ label: string }> = ({ label }) => (
  <span className="text-wehrli mt-5 inline-flex items-center gap-1.5 text-sm font-bold">
    {label}
    <ArrowRightIcon
      aria-hidden
      className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
    />
  </span>
);

/** The lead story: large picture beside title, eyebrow and lead text. */
const Lead: FC<{ article: ChildPage }> = ({ article }) => (
  <NextLink href={article.href} className="group grid items-center gap-6 no-underline lg:grid-cols-12 lg:gap-12">
    <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-gray-200 lg:col-span-7">
      <Image image={article.image} sizes={LEAD_SIZES} hoverZoom absolute />
    </div>
    <div className="lg:col-span-5">
      {article.eyebrow && <p className="text-xs font-bold text-gray-600">{article.eyebrow}</p>}
      <h2 className="text-wehrli md:text-title mt-2 text-xl leading-tight font-bold text-balance break-words">
        {article.title}
      </h2>
      {article.description && <p className="mt-4 text-base text-pretty text-black">{article.description}</p>}
      <ReadMore label={article.linkLabel} />
    </div>
  </NextLink>
);

/** One article in the list: picture on top, text below, no card frame (set apart from the page teasers). */
const Teaser: FC<{ article: ChildPage }> = ({ article }) => (
  <NextLink href={article.href} className="group flex h-full flex-col no-underline">
    <div className="relative aspect-[3/2] overflow-hidden rounded-md bg-gray-200">
      <Image image={article.image} sizes={GRID_SIZES} hoverZoom absolute />
    </div>
    {article.eyebrow && <p className="mt-5 text-xs font-bold text-gray-600">{article.eyebrow}</p>}
    <h3 className="text-wehrli mt-1.5 text-lg leading-snug font-bold text-balance break-words hyphens-auto">
      {article.title}
    </h3>
    {article.description && <p className="mt-2 line-clamp-3 text-sm text-black">{article.description}</p>}
    <ReadMore label={article.linkLabel} />
  </NextLink>
);

/**
 * The start page of the magazine: the first article as lead story, the others below in three columns, each with a
 * large picture and its category (eyebrow).
 */
export const ArticleIndexBlock: FC<Props> = ({ articles, moreTitle }) => {
  const [lead, ...more] = articles;

  if (!lead) {
    return null;
  }

  return (
    <Section>
      <Lead article={lead} />
      {more.length > 0 && (
        <div className="mt-16 border-t border-gray-200 pt-12 lg:mt-24 lg:pt-16">
          <Heading level="2">{moreTitle}</Heading>
          <ul className="mt-8 grid list-none gap-x-6 gap-y-12 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
            {more.map((article) => (
              <li key={article.id}>
                <Teaser article={article} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </Section>
  );
};
