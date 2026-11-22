import { JsonLd } from '@/components/seo/json-ld';
import { FaqBlockFragment } from '@/graphql/generated';
import { FaqBlock as FaqBlockView } from '@wehrli/design-system';
import { FC } from 'react';
import { getCmsPagePath } from '../paths';
import { getSiteTexts } from '../site-texts';

type Props = {
  block: FaqBlockFragment;
};

/** Questions of a page with their FAQPage structured data. */
export const FaqBlock: FC<Props> = async ({ block }) => {
  const texts = await getSiteTexts();
  const allFaqsHref = getCmsPagePath(block.allFaqsPage);

  return (
    <>
      <FaqBlockView
        title={block.faqTitle?.trim() ? block.faqTitle : texts.faqBlockTitle}
        intro={block.faqIntro}
        items={block.faqs.map(({ id, question, answer }) => ({ id, question, answer }))}
        allFaqsLink={
          allFaqsHref
            ? { label: block.allFaqsLinkText?.trim() ? block.allFaqsLinkText.trim() : texts.faqAllLink, href: allFaqsHref }
            : null
        }
        labels={{ eyebrow: texts.faqBlockEyebrow }}
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
