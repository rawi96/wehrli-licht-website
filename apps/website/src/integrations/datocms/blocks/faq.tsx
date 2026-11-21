import { JsonLd } from '@/components/seo/json-ld';
import { FaqBlockFragment } from '@/graphql/generated';
import { FaqBlock as FaqBlockView } from '@wehrli/design-system';
import { FC } from 'react';
import { getCmsPagePath } from '../paths';

type Props = {
  block: FaqBlockFragment;
};

const DEFAULT_ALL_FAQS_LABEL = 'Alle Fragen ansehen';

const toLinkLabel = (text?: string | null): string => (text?.trim() ? text.trim() : DEFAULT_ALL_FAQS_LABEL);

/** Questions of a page with their FAQPage structured data. */
export const FaqBlock: FC<Props> = ({ block }) => {
  const allFaqsHref = getCmsPagePath(block.allFaqsPage);

  return (
    <>
      <FaqBlockView
        title={block.faqTitle}
        intro={block.faqIntro}
        items={block.faqs.map(({ id, question, answer }) => ({ id, question, answer }))}
        allFaqsLink={allFaqsHref ? { label: toLinkLabel(block.allFaqsLinkText), href: allFaqsHref } : null}
        marginTop={!block.disableMarginTop}
        marginBottom={!block.disableMarginBottom}
      />
      {block.faqs.length > 0 && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: block.faqs.map(({ question, answer }) => ({
              '@type': 'Question',
              name: question,
              acceptedAnswer: { '@type': 'Answer', text: answer },
            })),
          }}
        />
      )}
    </>
  );
};
