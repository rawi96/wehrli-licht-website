import { Heading } from '@/components/nodes';
import { faqCardClass } from '@/components/faq/faq-styles';
import type { FaqTopicGroup } from '@/utils/faq/group-by-topic';
import { formatFaqCount } from '@/utils/faq/format-faq-count';
import { FC } from 'react';

type Props = {
  groups: FaqTopicGroup[];
};

export const FaqTopicSections: FC<Props> = ({ groups }) => (
  <div className="space-y-10 lg:space-y-12">
    {groups.map((group) => {
      const headingId = `faq-topic-${group.topic.slug}`;

      return (
        <section
          key={group.topic.id}
          id={group.topic.slug}
          aria-labelledby={headingId}
          className={`scroll-mt-28 ${faqCardClass}`}
        >
          <div className="border-wehrli mb-8 border-b-2 pb-5">
            <Heading level="2" id={headingId}>
              {group.topic.title}
            </Heading>
            <p className="mt-2 text-sm text-gray-600">{formatFaqCount(group.faqs.length)}</p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:gap-x-12">
            {group.faqs.map((faq) => {
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
