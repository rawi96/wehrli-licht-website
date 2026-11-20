import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { FC, ReactNode } from 'react';
import { Label, TextInput } from '../../forms/field/field';
import { Heading } from '../../typography/heading/heading';

// Parts of the FAQ page. The website groups, filters and counts the questions and passes the result.

const CARD_CLASS = 'bg-white p-6 shadow-sm sm:p-8 lg:p-10';

type FaqLinkProps = { href: string; children: ReactNode };

/** A bold link inside FAQ texts, underlined on hover. */
export const FaqLink: FC<FaqLinkProps> = ({ href, children }) => (
  <Link
    href={href}
    className="text-wehrli hover:border-wehrli border-b-2 border-transparent font-bold no-underline transition-colors duration-150"
  >
    {children}
  </Link>
);

export type FaqTopicLink = {
  id: string;
  label: string;
  /** In-page anchor of the topic section, e.g. `#faq-topic-lieferung`. */
  href: string;
};

type FaqIntroProps = {
  title: string;
  /** Lead text below the title (may contain FaqLinks). */
  intro: ReactNode;
  /** The search field (FaqSearch). */
  search: ReactNode;
  /** Jump links to the topic sections, shown with more than one topic. */
  topics: FaqTopicLink[];
  labels?: { topicsNavigation?: string; topics?: string };
};

/** Head of the FAQ page: title, lead text, search and topic links. */
export const FaqIntro: FC<FaqIntroProps> = ({ title, intro, search, topics, labels }) => (
  <header className="mt-20 mb-12 lg:mt-24 lg:mb-16">
    <Heading level="1" id="faq-page-heading">
      {title}
    </Heading>
    <p className="mt-4 max-w-2xl text-sm md:max-w-prose lg:text-base">{intro}</p>

    <div className="mt-8">{search}</div>

    {topics.length > 1 && (
      <nav aria-label={labels?.topicsNavigation ?? 'Themen auf dieser Seite'} className="mt-8">
        <p className="text-wehrli mb-3 text-sm font-bold">{labels?.topics ?? 'Themen'}</p>
        <ul className="flex flex-wrap gap-2">
          {topics.map((topic) => (
            <li key={topic.id}>
              <a
                href={topic.href}
                className="bg-white-100 text-wehrli hover:bg-wehrli inline-block rounded-full px-4 py-2 text-sm font-bold transition-colors duration-150 hover:text-white"
              >
                {topic.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    )}
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
    <div className="relative mt-1 max-w-xl">
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

type FaqTopicsProps = { topics: FaqTopic[] };

/** One card per topic with its questions and answers in two columns. */
export const FaqTopics: FC<FaqTopicsProps> = ({ topics }) => (
  <div className="space-y-10 lg:space-y-12">
    {topics.map((topic) => {
      const headingId = `faq-topic-${topic.slug}`;

      return (
        <section key={topic.id} id={topic.slug} aria-labelledby={headingId} className={`scroll-mt-28 ${CARD_CLASS}`}>
          <div className="border-wehrli mb-8 border-b-2 pb-5">
            <Heading level="2" id={headingId}>
              {topic.title}
            </Heading>
            <p className="mt-2 text-sm text-gray-600">{topic.countLabel}</p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:gap-x-12">
            {topic.questions.map((faq) => {
              const questionId = `faq-${faq.slug}`;

              return (
                <article key={faq.id} id={faq.slug} className="scroll-mt-32" aria-labelledby={questionId}>
                  <h3 id={questionId} className="text-wehrli text-base font-bold lg:text-lg">
                    {faq.question}
                  </h3>
                  <p className="mt-3 text-sm whitespace-pre-line md:max-w-prose lg:text-base">{faq.answer}</p>
                </article>
              );
            })}
          </div>
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
  <div className={`${CARD_CLASS} text-center`} role="status" aria-live="polite">
    <p className="text-wehrli text-base font-bold">{title}</p>
    <p className="mt-2 text-sm text-gray-600">{children}</p>
  </div>
);

type FaqContactCtaProps = {
  title?: string;
  /** Text with a link to the contact page (FaqLink). */
  children: ReactNode;
};

/** Card at the end of the FAQ page that points to the contact page. */
export const FaqContactCta: FC<FaqContactCtaProps> = ({ title = 'Noch Fragen?', children }) => (
  <section className={`mt-12 scroll-mt-28 lg:mt-16 ${CARD_CLASS}`} aria-labelledby="faq-contact-heading">
    <Heading level="2" id="faq-contact-heading">
      {title}
    </Heading>
    <p className="mt-3 max-w-2xl text-sm lg:text-base">{children}</p>
  </section>
);
