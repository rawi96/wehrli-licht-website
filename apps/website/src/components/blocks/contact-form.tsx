import { ContactForm } from '@/components/contact/contact-form';
import { ContactFormBlockFragment } from '@/graphql/generated';
import { CONTACT_FORM_ANCHOR } from '@/features/contact/schema';
import { getCmsPagePath } from '@/utils/cms-page-path';
import { getHeaderFooter } from '@/utils/get-header-footer';
import { toLines } from '@/utils/text';
import { ContactFormBlock as ContactFormBlockView } from '@wehrli/design-system';

type Props = {
  block: ContactFormBlockFragment;
};

export const ContactFormBlock = async ({
  block: { id, formTitle, formIntro, topics, disableMarginTop, disableMarginBottom },
}: Props) => {
  const headerFooter = await getHeaderFooter();

  return (
    // The anchor lets «Fragen zu dieser Leuchte?» jump straight to the form.
    <ContactFormBlockView
      anchorId={CONTACT_FORM_ANCHOR}
      title={formTitle}
      intro={formIntro}
      marginTop={!disableMarginTop}
      marginBottom={!disableMarginBottom}
    >
      <ContactForm
        formId={`contact-${id}`}
        topics={toLines(topics)}
        privacyHref={getCmsPagePath(headerFooter.privacyPage)}
      />
    </ContactFormBlockView>
  );
};
