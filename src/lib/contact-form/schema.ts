export type ContactFormValues = {
  name: string;
  email: string;
  phone: string;
  /** One of the topics configured on the CMS block (free text, the list is editable). */
  topic: string;
  message: string;
};

/** Anchor id of the contact form block, used by links that jump straight to the form. */
export const CONTACT_FORM_ANCHOR = 'kontaktformular';

/** Query parameter set by «Fragen zu dieser Leuchte?» on product pages to prefill the message. */
export const PRODUCT_PREFILL_PARAM = 'produkt';

/** Honeypot field name: hidden from humans, bots tend to fill it in. */
export const HONEYPOT_FIELD = 'website';

/** Submissions faster than this after the form appeared are treated as bots. */
export const MIN_FILL_TIME_MS = 3000;

export type ContactFieldErrors = Partial<Record<keyof ContactFormValues, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^[+\d\s()/.-]{6,30}$/;
const MAX_LINKS = 2;

const countLinks = (text: string): number => (text.match(/https?:\/\/|www\./gi) ?? []).length;

type ValidationOptions = {
  /** The block offers topics, so one must be chosen (only known on the client). */
  topicRequired?: boolean;
};

export const validateContactForm = (
  values: ContactFormValues,
  { topicRequired = false }: ValidationOptions = {},
): ContactFieldErrors => {
  const errors: ContactFieldErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const phone = values.phone.trim();
  const message = values.message.trim();

  if (name.length < 2 || name.length > 100) {
    errors.name = 'Bitte geben Sie Ihren Namen an.';
  }

  if (!EMAIL_PATTERN.test(email) || email.length > 200) {
    errors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse an.';
  }

  if (phone && !PHONE_PATTERN.test(phone)) {
    errors.phone = 'Bitte geben Sie eine gültige Telefonnummer an.';
  }

  const topic = values.topic.trim();
  if ((topicRequired && !topic) || topic.length > 100) {
    errors.topic = 'Bitte wählen Sie ein Anliegen.';
  }

  if (message.length < 10) {
    errors.message = 'Bitte beschreiben Sie Ihr Anliegen in ein paar Worten.';
  } else if (message.length > 5000) {
    errors.message = 'Ihre Nachricht ist zu lang (maximal 5000 Zeichen).';
  } else if (countLinks(message) > MAX_LINKS) {
    errors.message = 'Bitte senden Sie maximal zwei Links mit.';
  }

  return errors;
};
