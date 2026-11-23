'use client';

import NextLink from 'next/link';
import { FC, FormEvent, Ref, useEffect, useRef } from 'react';
import { Button } from '../../actions/button/button';
import { FieldError, FormError, Label, Select, Textarea, TextInput } from '../field/field';

export type ContactFormValues = {
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
};

export type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;

export type ContactFormStatus = 'idle' | 'sending' | 'sent' | 'error';

export type ContactFormLabels = {
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
  submit: string;
  successTitle: string;
  successText: string;
  privacyNote: string;
  /** Text before the privacy link, e.g. «Mehr in unserer». */
  privacyLinkIntro: string;
  privacyLink: string;
};

const DEFAULT_LABELS: ContactFormLabels = {
  name: 'Name *',
  email: 'E-Mail *',
  phone: 'Telefon (optional)',
  topic: 'Anliegen *',
  message: 'Nachricht *',
  submit: 'Anfrage senden',
  successTitle: 'Vielen Dank für Ihre Anfrage!',
  successText: 'Wir haben Ihre Nachricht erhalten und melden uns so rasch wie möglich bei Ihnen.',
  privacyNote: 'Ihre Angaben verwenden wir nur zur Beantwortung Ihrer Anfrage.',
  privacyLinkIntro: 'Mehr in unserer',
  privacyLink: 'Datenschutzerklärung',
};

type Props = {
  /** Prefix of the field ids, unique on the page. */
  formId: string;
  values: ContactFormValues;
  onChange: (field: keyof ContactFormValues, value: string) => void;
  /** Called on submit (the browser's own validation is off); the website validates and sends. */
  onSubmit: () => void;
  /** Validation messages per field, shown below the fields. */
  errors?: ContactFormErrors;
  /** `sending` shows a spinner on the button, `sent` replaces the form with the success message. */
  status: ContactFormStatus;
  /** Error of the whole form (e.g. sending failed), shown with status `error`. */
  errorMessage?: string | null;
  /** Topics to choose from. Without topics the field is hidden. */
  topics: string[];
  /** Privacy page; without it the link is left out. */
  privacyHref?: string | null;
  /** Name and ref of the hidden honeypot field: invisible for people and screen readers, bots fill it in. */
  honeypot: { name: string; ref?: Ref<HTMLInputElement> };
  labels?: Partial<ContactFormLabels>;
};

/** Contact form: name, e-mail, phone, topic and message, with validation messages and a success message. */
export const ContactForm: FC<Props> = ({
  formId,
  values,
  onChange,
  onSubmit,
  errors = {},
  status,
  errorMessage,
  topics,
  privacyHref,
  honeypot,
  labels: customLabels,
}) => {
  const labels = { ...DEFAULT_LABELS, ...customLabels };
  const successRef = useRef<HTMLDivElement>(null);

  // The form (and the focused submit button) is replaced by the success message: move focus there
  // so keyboard and screen reader users are not dropped back to the top of the page.
  useEffect(() => {
    if (status === 'sent') {
      successRef.current?.focus();
    }
  }, [status]);

  if (status === 'sent') {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="card-surface p-6">
        <p className="text-wehrli text-lg font-bold">{labels.successTitle}</p>
        <p className="mt-2 text-sm lg:text-base">{labels.successText}</p>
      </div>
    );
  }

  const field = (name: keyof ContactFormValues) => ({
    id: `${formId}-${name}`,
    name,
    value: values[name],
    onChange: (value: string) => onChange(name, value),
    invalid: !!errors[name],
    describedBy: errors[name] ? `${formId}-${name}-error` : undefined,
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor={`${formId}-name`}>{labels.name}</Label>
          <TextInput {...field('name')} type="text" autoComplete="name" required />
          <FieldError id={`${formId}-name-error`} message={errors.name} />
        </div>
        <div>
          <Label htmlFor={`${formId}-email`}>{labels.email}</Label>
          <TextInput {...field('email')} type="email" autoComplete="email" required />
          <FieldError id={`${formId}-email-error`} message={errors.email} />
        </div>
        <div>
          <Label htmlFor={`${formId}-phone`}>{labels.phone}</Label>
          <TextInput {...field('phone')} type="tel" autoComplete="tel" />
          <FieldError id={`${formId}-phone-error`} message={errors.phone} />
        </div>
        {topics.length > 0 && (
          <div>
            <Label htmlFor={`${formId}-topic`}>{labels.topic}</Label>
            <Select {...field('topic')} options={topics.map((topic) => ({ value: topic, label: topic }))} />
            <FieldError id={`${formId}-topic-error`} message={errors.topic} />
          </div>
        )}
      </div>

      <div>
        <Label htmlFor={`${formId}-message`}>{labels.message}</Label>
        <Textarea {...field('message')} rows={6} required />
        <FieldError id={`${formId}-message-error`} message={errors.message} />
      </div>

      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${formId}-${honeypot.name}`}>Website</label>
        <input ref={honeypot.ref} id={`${formId}-${honeypot.name}`} type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {status === 'error' && errorMessage && <FormError>{errorMessage}</FormError>}

      <p className="text-xs text-gray-600">
        {labels.privacyNote}
        {privacyHref && (
          <>
            {' '}
            {labels.privacyLinkIntro}{' '}
            <NextLink href={privacyHref} className="underline">
              {labels.privacyLink}
            </NextLink>
            .
          </>
        )}
      </p>

      <Button variant="primary" type="submit" loading={status === 'sending'}>
        {labels.submit}
      </Button>
    </form>
  );
};
