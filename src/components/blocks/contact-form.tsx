import { ContactForm } from '@/components/contact/contact-form';
import { Heading } from '@/components/nodes';
import { ContactFormBlockFragment } from '@/graphql/generated';
import { CONTACT_FORM_ANCHOR } from '@/lib/contact-form/schema';
import { getCmsPagePath } from '@/utils/cms-page-path';
import { getHeaderFooter } from '@/utils/get-header-footer';
import { toLines } from '@/utils/text';
import { BlockWrapper } from '../block-wrapper';

type Props = {
  block: ContactFormBlockFragment;
};

export const ContactFormBlock = async ({
  block: { id, formTitle, formIntro, topics, disableMarginTop, disableMarginBottom },
}: Props) => {
  const headerFooter = await getHeaderFooter();

  return (
    // The anchor lets «Fragen zu dieser Leuchte?» jump straight to the form.
    <BlockWrapper
      className="scroll-mt-28"
      anchorId={CONTACT_FORM_ANCHOR}
      disableMarginTop={disableMarginTop}
      disableMarginBottom={disableMarginBottom}
    >
      <div className="mx-auto max-w-3xl px-4 lg:px-0">
        {formTitle && <Heading level="2">{formTitle}</Heading>}
        {formIntro && <p className="mb-8 text-base whitespace-pre-line">{formIntro}</p>}
        <ContactForm
          formId={`contact-${id}`}
          topics={toLines(topics)}
          privacyHref={getCmsPagePath(headerFooter.privacyPage)}
        />
      </div>
    </BlockWrapper>
  );
};
