import { ArrowRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { FC, ReactNode } from 'react';
import { Label, TextInput } from '../../forms/field/field';
import { Heading } from '../../typography/heading/heading';
import { FaqAccordion } from '../faq-accordion/faq-accordion';

// Parts of the FAQ page. The website groups, filters and counts the questions and passes the result.

type FaqLinkProps = { href: string; children: ReactNode };

/** A bold link inside FAQ texts, underlined on hover. */
export const FaqLink: FC<FaqLinkProps> = ({ href, children }) => (
  <Link
    href={href}
    className="text-wehrli hover:border-wehrli border-b-2 border-transparent font-bold no-underline transition-colors"
  >
    {children}
  </Link>
);

/** Id of a topic's heading, the target of the topic links in FaqIntro. */
const topicHeadingId = (slug: string) => `faq-topic-${slug}`;

export type FaqTopicLink = {
  id: string;
  label: string;
  /** Slug of the topic, as in FaqTopic. */
  slug: string;
};

type FaqIntroProps = {
  title: string;
  /** Lead text below the title (may contain FaqLinks). */
  intro: ReactNode;
  /** The search field (FaqSearch). */
  search: ReactNode;
  /** Jump links to the topic sections, shown with more than one topic. */
  topics: FaqTopicLink[];
  /** `eyebrow` above the title (DatoCMS «Texte & Beschriftungen»). */
  labels?: { eyebrow?: string; topicsNavigation?: string; topics?: string };
};

/** Head of the FAQ page: title and lead text, then a card with the search and the topic links. */
export const FaqIntro: FC<FaqIntroProps> = ({ title, intro, search, topics, labels }) => (
  <header className="mt-20 mb-12 lg:mt-24 lg:mb-16">
    <p className="text-wehrli mb-3 text-xs font-bold">{labels?.eyebrow ?? 'FAQ'}</p>
    <Heading level="1" id="faq-page-heading">
      {title}
    </Heading>
    <p className="max-w-2xl text-sm md:max-w-prose lg:text-base">{intro}</p>
    <div className="card-surface mt-8 p-6 sm:p-8">
      {search}
      {topics.length > 1 && (
        <nav
          aria-label={labels?.topicsNavigation ?? 'Themen auf dieser Seite'}
          className="mt-6 border-t border-gray-200 pt-6"
        >
          <p className="mb-3 text-xs font-bold text-gray-600">{labels?.topics ?? 'Themen'}</p>
          <ul className="flex flex-wrap gap-2">
            {topics.map((topic) => (
              <li key={topic.id}>
                <a
                  href={`#${topicHeadingId(topic.slug)}`}
                  className="hover:border-wehrli hover:bg-wehrli text-wehrli inline-block rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-bold transition-colors hover:text-white"
                >
                  {topic.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  </header>
);

type FaqSearchProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  /** Result summary below the field, announced to screen readers. */
  status: string;
  label?: string;
  placeholder?: string;
};

/** Search field of the FAQ page with a live result summary. Render it from a client component. */
export const FaqSearch: FC<FaqSearchProps> = ({
  id,
  value,
  onChange,
  status,
  label = 'FAQ durchsuchen',
  placeholder = 'Stichwort, z. B. Lampenschirm, Lieferung, Lichtplanung…',
}) => (
  <div>
    <Label htmlFor={id}>{label}</Label>
    <div className="relative mt-1">
      <MagnifyingGlassIcon
        className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-gray-400"
        aria-hidden
      />
      <TextInput
        id={id}
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
        withIcon
      />
    </div>
    <p className="mt-2 text-sm text-gray-600" role="status" aria-live="polite">
      {status}
    </p>
  </div>
);

export type FaqQuestion = {
  id: string;
  /** Anchor of the question. */
  slug: string;
  question: string;
  /** Plain text; line breaks are kept. */
  answer: string;
};

export type FaqTopic = {
  id: string;
  /** Anchor of the section; the heading gets `faq-topic-<slug>`. */
  slug: string;
  title: string;
  /** E.g. «3 Fragen». */
  countLabel: string;
  questions: FaqQuestion[];
};

type FaqTopicsProps = {
  topics: FaqTopic[];
  /** All answers open, e.g. while searching. */
  expanded?: boolean;
  /** `topic` above each topic title. */
  labels?: { topic?: string };
};

/** One card per topic: title and count on the left, the questions as an accordion on the right (as the FAQ block). */
export const FaqTopics: FC<FaqTopicsProps> = ({ topics, expanded, labels }) => (
  <div className="space-y-8 lg:space-y-10">
    {topics.map((topic) => {
      const headingId = topicHeadingId(topic.slug);

      return (
        <section
          key={topic.id}
          id={topic.slug}
          aria-labelledby={headingId}
          className="grid scroll-mt-28 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-12"
        >
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-wehrli mb-3 text-xs font-bold">{labels?.topic ?? 'Thema'}</p>
            <h2 id={headingId} className="text-wehrli scroll-mt-28 text-lg font-bold break-words md:text-xl">
              {topic.title}
            </h2>
            <p className="mt-2 text-sm text-gray-600">{topic.countLabel}</p>
          </div>
          <FaqAccordion
            expanded={expanded}
            items={topic.questions.map(({ id, slug, question, answer }) => ({ id, anchor: slug, question, answer }))}
          />
        </section>
      );
    })}
  </div>
);

type FaqNoResultsProps = {
  title?: string;
  /** Hint below the title (may contain FaqLinks). */
  children: ReactNode;
};

/** Shown instead of the topics when the search finds nothing. */
export const FaqNoResults: FC<FaqNoResultsProps> = ({ title = 'Keine passenden Fragen gefunden', children }) => (
  <div className="card-surface p-8 text-center lg:p-12" role="status" aria-live="polite">
    <p className="text-wehrli text-base font-bold">{title}</p>
    <p className="mt-2 text-sm text-gray-600">{children}</p>
  </div>
);

type FaqContactCtaProps = {
  title?: string;
  /** Text below the title. */
  children: ReactNode;
  /** Button to the contact page. */
  action?: { label: string; href: string } | null;
};

/** Brand card at the end of the FAQ page that points to the contact page. */
export const FaqContactCta: FC<FaqContactCtaProps> = ({ title = 'Noch Fragen?', children, action }) => (
  <section
    className="surface-dark bg-wehrli mt-12 flex scroll-mt-28 flex-col gap-6 rounded-md p-6 text-white sm:p-8 lg:mt-16 lg:flex-row lg:items-center lg:justify-between lg:p-12"
    aria-labelledby="faq-contact-heading"
  >
    <div>
      <h2 id="faq-contact-heading" className="text-lg font-bold md:text-xl">
        {title}
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-white/80 lg:text-base">{children}</p>
    </div>
    {action && (
      <Link
        href={action.href}
        className="group text-wehrli inline-flex shrink-0 items-center gap-x-2 self-start rounded-md bg-white px-5 py-3 text-sm font-bold transition-colors hover:bg-gray-100 lg:self-auto"
      >
        {action.label}
        <ArrowRightIcon
          className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
          aria-hidden="true"
        />
      </Link>
    )}
  </section>
);
