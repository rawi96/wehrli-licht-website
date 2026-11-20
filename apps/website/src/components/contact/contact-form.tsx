'use client';

import { Button } from '@wehrli/design-system';
import {
  checkoutInlineErrorClass,
  checkoutInputClass,
  checkoutLabelClass,
  checkoutTextareaClass,
} from '@/components/shop/checkout-styles';
import { setEnhancedConversionEmail, trackEvent } from '@/lib/analytics/gtag';
import {
  ContactFieldErrors,
  ContactFormValues,
  HONEYPOT_FIELD,
  PRODUCT_PREFILL_PARAM,
  validateContactForm,
} from '@/lib/contact-form/schema';
import Link from 'next/link';
import { FC, FormEvent, useEffect, useRef, useState } from 'react';

type Status = 'idle' | 'sending' | 'sent' | 'error';

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

const FieldError: FC<{ id: string; message?: string }> = ({ id, message }) =>
  message ? (
    <p id={id} className="text-error-700 mt-1 text-sm">
      {message}
    </p>
  ) : null;

type Props = {
  formId: string;
  /** Topics configured on the CMS block; the first is preselected. Without topics the field is hidden. */
  topics: string[];
  /** Privacy page from DatoCMS («Header & Footer»), link omitted if not set. */
  privacyHref: string | null;
};

export const ContactForm: FC<Props> = ({ formId, topics, privacyHref }) => {
  const [values, setValues] = useState<ContactFormValues>({
    name: '',
    email: '',
    phone: '',
    topic: topics[0] ?? '',
    message: '',
  });
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string>();
  const shownAtRef = useRef(0);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    shownAtRef.current = Date.now();
    const prefill = readProductPrefill();
    if (Object.keys(prefill).length > 0) {
      // eslint-disable-next-line @eslint-react/set-state-in-effect -- URL params are only readable after mount
      setValues((current) => ({ ...current, ...prefill }));
    }
  }, []);

  // The form (and the focused submit button) is replaced by the success message: move focus there
  // so keyboard and screen reader users are not dropped back to the top of the page.
  useEffect(() => {
    if (status === 'sent') {
      successRef.current?.focus();
    }
  }, [status]);

  const update = (field: keyof ContactFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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

      setEnhancedConversionEmail(values.email);
      trackEvent('generate_lead', { lead_source: 'kontaktformular', ...(values.topic && { anliegen: values.topic }) });
      setStatus('sent');
    } catch {
      setErrorMessage('Die Anfrage konnte nicht gesendet werden. Bitte prüfen Sie Ihre Internetverbindung.');
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="bg-white-200 rounded-lg p-6 ring-1 ring-gray-200">
        <p className="text-wehrli text-lg font-bold">Vielen Dank für Ihre Anfrage!</p>
        <p className="mt-2 text-sm lg:text-base">
          Wir haben Ihre Nachricht erhalten und melden uns so rasch wie möglich bei Ihnen.
        </p>
      </div>
    );
  }

  const field = (name: keyof ContactFormValues) => ({
    id: `${formId}-${name}`,
    name,
    value: values[name],
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${formId}-${name}-error` : undefined,
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${formId}-name`} className={checkoutLabelClass}>
            Name *
          </label>
          <input
            {...field('name')}
            type="text"
            autoComplete="name"
            required
            className={checkoutInputClass}
            onChange={(e) => update('name', e.target.value)}
          />
          <FieldError id={`${formId}-name-error`} message={errors.name} />
        </div>
        <div>
          <label htmlFor={`${formId}-email`} className={checkoutLabelClass}>
            E-Mail *
          </label>
          <input
            {...field('email')}
            type="email"
            autoComplete="email"
            required
            className={checkoutInputClass}
            onChange={(e) => update('email', e.target.value)}
          />
          <FieldError id={`${formId}-email-error`} message={errors.email} />
        </div>
        <div>
          <label htmlFor={`${formId}-phone`} className={checkoutLabelClass}>
            Telefon (optional)
          </label>
          <input
            {...field('phone')}
            type="tel"
            autoComplete="tel"
            className={checkoutInputClass}
            onChange={(e) => update('phone', e.target.value)}
          />
          <FieldError id={`${formId}-phone-error`} message={errors.phone} />
        </div>
        {topics.length > 0 && (
          <div>
            <label htmlFor={`${formId}-topic`} className={checkoutLabelClass}>
              Anliegen *
            </label>
            <select {...field('topic')} className={checkoutInputClass} onChange={(e) => update('topic', e.target.value)}>
              {topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
            <FieldError id={`${formId}-topic-error`} message={errors.topic} />
          </div>
        )}
      </div>

      <div>
        <label htmlFor={`${formId}-message`} className={checkoutLabelClass}>
          Nachricht *
        </label>
        <textarea
          {...field('message')}
          rows={6}
          required
          className={`${checkoutTextareaClass} min-h-40`}
          onChange={(e) => update('message', e.target.value)}
        />
        <FieldError id={`${formId}-message-error`} message={errors.message} />
      </div>

      {/* Honeypot: invisible for people and screen readers, bots fill it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${formId}-${HONEYPOT_FIELD}`}>Website</label>
        <input ref={honeypotRef} id={`${formId}-${HONEYPOT_FIELD}`} type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {status === 'error' && errorMessage && (
        <p role="alert" className={checkoutInlineErrorClass}>
          {errorMessage}
        </p>
      )}

      <p className="text-xs text-gray-600">
        Ihre Angaben verwenden wir nur zur Beantwortung Ihrer Anfrage.
        {privacyHref && (
          <>
            {' '}
            Mehr in unserer{' '}
            <Link href={privacyHref} className="underline">
              Datenschutzerklärung
            </Link>
            .
          </>
        )}
      </p>

      <Button variant="primary" type="submit" loading={status === 'sending'}>
        Anfrage senden
      </Button>
    </form>
  );
};
