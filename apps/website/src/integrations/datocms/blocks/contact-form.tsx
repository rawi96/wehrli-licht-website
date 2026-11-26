import { ContactForm } from '@/components/contact/contact-form';
import { ContactFormBlockFragment } from '@/graphql/generated';
import { CONTACT_FORM_ANCHOR } from '@/domain/contact/links';
import { ContactFormBlock as ContactFormBlockView } from '@wehrli/design-system';
import { getSiteLayout } from '../site-layout';
import { getSiteTexts } from '../site-texts';
import { toLines } from '../text';

type Props = {
  block: ContactFormBlockFragment;
};

export const ContactFormBlock = async ({
  block: { id, formTitle, formIntro, topics, disableMarginTop, disableMarginBottom },
}: Props) => {
  const [{ privacyPath, contact }, texts] = await Promise.all([getSiteLayout(), getSiteTexts()]);

  return (
    // The anchor lets «Fragen zu dieser Leuchte?» jump straight to the form.
    <ContactFormBlockView
      anchorId={CONTACT_FORM_ANCHOR}
      title={formTitle}
      intro={formIntro}
      direct={{
        phone: contact.phone,
        email: contact.email,
        address: [contact.street ?? '', `${contact.zip ?? ''} ${contact.place ?? ''}`.trim()].filter(
          (line) => line.length > 0,
        ),
        mapsHref: contact.mapsHref,
      }}
      marginTop={!disableMarginTop}
      marginBottom={!disableMarginBottom}
    >
      <ContactForm
        formId={`contact-${id}`}
        topics={toLines(topics)}
        privacyHref={privacyPath}
        labels={{
          submit: texts.contactSubmit,
          successTitle: texts.contactSuccessTitle,
          successText: texts.contactSuccessText,
          privacyNote: texts.contactPrivacyNote,
        }}
      />
    </ContactFormBlockView>
  );
};
