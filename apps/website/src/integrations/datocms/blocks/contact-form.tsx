import { ContactForm } from '@/components/contact/contact-form';
import { ContactFormBlockFragment } from '@/graphql/generated';
import { CONTACT_FORM_ANCHOR } from '@/domain/contact/links';
import { ContactFormBlock as ContactFormBlockView } from '@wehrli/design-system';
import { getSiteLayout } from '../site-layout';
import { toLines } from '../text';

type Props = {
  block: ContactFormBlockFragment;
};

export const ContactFormBlock = async ({
  block: { id, formTitle, formIntro, topics, disableMarginTop, disableMarginBottom },
}: Props) => {
  const { privacyPath } = await getSiteLayout();

  return (
    // The anchor lets «Fragen zu dieser Leuchte?» jump straight to the form.
    <ContactFormBlockView
      anchorId={CONTACT_FORM_ANCHOR}
      title={formTitle}
      intro={formIntro}
      marginTop={!disableMarginTop}
      marginBottom={!disableMarginBottom}
    >
      <ContactForm formId={`contact-${id}`} topics={toLines(topics)} privacyHref={privacyPath} />
    </ContactFormBlockView>
  );
};
