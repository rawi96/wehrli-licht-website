import { ContactForm } from '@/components/contact/contact-form';
import { Heading } from '@/components/nodes';
import { ContactFormBlockFragment } from '@/graphql/generated';
import { BotIdClient } from 'botid/client';
import { FC } from 'react';
import { BlockWrapper } from '../block-wrapper';

type Props = {
  block: ContactFormBlockFragment;
};

/** Anchor used by links that jump straight to the form, e.g. "Frage zu dieser Leuchte". */
export const CONTACT_FORM_ANCHOR = 'kontaktformular';

export const ContactFormBlock: FC<Props> = ({
  block: { id, formTitle, formIntro, disableMarginTop, disableMarginBottom },
}) => (
  <BlockWrapper
    className="scroll-mt-28"
    anchorId={CONTACT_FORM_ANCHOR}
    disableMarginTop={disableMarginTop}
    disableMarginBottom={disableMarginBottom}
  >
    <div className="mx-auto max-w-3xl px-4 lg:px-0">
      {formTitle && <Heading level="2">{formTitle}</Heading>}
      {formIntro && <p className="mb-8 text-base whitespace-pre-line">{formIntro}</p>}
      {/* Invisible bot protection, only loaded on pages that actually show the form. */}
      <BotIdClient protect={[{ path: '/api/contact', method: 'POST' }]} />
      <ContactForm formId={`contact-${id}`} />
    </div>
  </BlockWrapper>
);
