'use client';

import {
  ContactFieldErrors,
  ContactFormValues,
  HONEYPOT_FIELD,
  PRODUCT_PREFILL_PARAM,
  validateContactForm,
} from '@/features/contact/schema';
import { analytics } from '@/integrations/client';
import { ContactForm as ContactFormView, ContactFormStatus } from '@wehrli/design-system';
import { FC, useEffect, useRef, useState } from 'react';

const readProductPrefill = (): Partial<ContactFormValues> => {
  const product = new URLSearchParams(window.location.search).get(PRODUCT_PREFILL_PARAM)?.slice(0, 200);

  return product ? { message: `Ich habe eine Frage zur Leuchte «${product}»:\n\n` } : {};
};

type ApiResult = { ok?: boolean; error?: string; fieldErrors?: ContactFieldErrors };

/** Server errors can be HTML (e.g. a proxy error page): never let parsing hide the real status. */
const readApiResult = async (response: Response): Promise<ApiResult> => {
  try {
    return (await response.json()) as ApiResult;
  } catch {
    return {};
  }
};

type Props = {
  formId: string;
  /** Topics configured on the CMS block; the first is preselected. Without topics the field is hidden. */
  topics: string[];
  /** Privacy page from DatoCMS («Header & Footer»), link omitted if not set. */
  privacyHref: string | null;
};

/** Connects the design system's ContactForm with validation, the contact API and lead tracking. */
export const ContactForm: FC<Props> = ({ formId, topics, privacyHref }) => {
  const [values, setValues] = useState<ContactFormValues>({
    name: '',
    email: '',
    phone: '',
    topic: topics[0] ?? '',
    message: '',
  });
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [status, setStatus] = useState<ContactFormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>();
  const shownAtRef = useRef(0);
  const honeypotRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    shownAtRef.current = Date.now();
    const prefill = readProductPrefill();
    if (Object.keys(prefill).length > 0) {
      // eslint-disable-next-line @eslint-react/set-state-in-effect -- URL params are only readable after mount
      setValues((current) => ({ ...current, ...prefill }));
    }
  }, []);

  const update = (field: keyof ContactFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const onSubmit = async () => {
    const fieldErrors = validateContactForm(values, { topicRequired: topics.length > 0 });
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) {
      return;
    }

    setStatus('sending');
    setErrorMessage(undefined);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          [HONEYPOT_FIELD]: honeypotRef.current?.value ?? '',
          fillTimeMs: Date.now() - shownAtRef.current,
          pagePath: window.location.pathname,
        }),
      });
      const result = await readApiResult(response);

      if (!response.ok || !result.ok) {
        setErrors(result.fieldErrors ?? {});
        setErrorMessage(result.error ?? 'Die Anfrage konnte nicht gesendet werden.');
        setStatus('error');

        return;
      }

      analytics.setLeadEmail(values.email);
      analytics.trackEvent('generate_lead', {
        lead_source: 'kontaktformular',
        ...(values.topic && { anliegen: values.topic }),
      });
      setStatus('sent');
    } catch {
      setErrorMessage('Die Anfrage konnte nicht gesendet werden. Bitte prüfen Sie Ihre Internetverbindung.');
      setStatus('error');
    }
  };

  return (
    <ContactFormView
      formId={formId}
      values={values}
      onChange={update}
      onSubmit={onSubmit}
      errors={errors}
      status={status}
      errorMessage={errorMessage}
      topics={topics}
      privacyHref={privacyHref}
      honeypot={{ name: HONEYPOT_FIELD, ref: honeypotRef }}
    />
  );
};
