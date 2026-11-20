import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ComponentProps, useState } from 'react';
import { ContactForm, ContactFormErrors, ContactFormStatus, ContactFormValues } from './contact-form';

type Args = Pick<ComponentProps<typeof ContactForm>, 'topics' | 'privacyHref' | 'status' | 'errorMessage' | 'errors'>;

const EMPTY: ContactFormValues = { name: '', email: '', phone: '', topic: '', message: '' };

/** Interactive example: validates on submit like the website does and pretends to send. */
const Example = ({ topics, privacyHref, status: initialStatus, errorMessage, errors: initialErrors }: Args) => {
  const [values, setValues] = useState<ContactFormValues>({ ...EMPTY, topic: topics[0] ?? '' });
  const [errors, setErrors] = useState<ContactFormErrors>(initialErrors ?? {});
  const [status, setStatus] = useState<ContactFormStatus>(initialStatus);

  return (
    <div className="max-w-3xl">
      <ContactForm
        formId="beispiel"
        values={values}
        onChange={(field, value) => {
          setValues((current) => ({ ...current, [field]: value }));
          setErrors((current) => ({ ...current, [field]: undefined }));
        }}
        onSubmit={() => {
          const nextErrors: ContactFormErrors = {
            ...(values.name.trim().length < 2 && { name: 'Bitte geben Sie Ihren Namen an.' }),
            ...(!values.email.includes('@') && { email: 'Bitte geben Sie eine gültige E-Mail-Adresse an.' }),
            ...(values.message.trim().length < 10 && {
              message: 'Bitte beschreiben Sie Ihr Anliegen in ein paar Worten.',
            }),
          };
          setErrors(nextErrors);
          if (Object.keys(nextErrors).length === 0) {
            setStatus('sending');
            setTimeout(() => setStatus('sent'), 1000);
          }
        }}
        errors={errors}
        status={status}
        errorMessage={errorMessage}
        topics={topics}
        privacyHref={privacyHref}
        honeypot={{ name: 'website' }}
      />
    </div>
  );
};

const meta: Meta<Args> = {
  title: 'Forms/ContactForm',
  args: {
    topics: ['Lichtplanung', 'Lichtberatung', 'Reparatur'],
    privacyHref: '#',
    status: 'idle',
  },
  render: (args) => <Example {...args} />,
  parameters: {
    docs: {
      description: {
        component:
          'The contact form fields, validation messages and success message. The form is controlled: the website keeps the values, validates, sends the request and sets `status`, `errors` and `errorMessage`.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const WithoutTopics: Story = { args: { topics: [], privacyHref: undefined } };

export const WithErrors: Story = {
  args: {
    errors: {
      name: 'Bitte geben Sie Ihren Namen an.',
      email: 'Bitte geben Sie eine gültige E-Mail-Adresse an.',
      message: 'Bitte beschreiben Sie Ihr Anliegen in ein paar Worten.',
    },
  },
};

export const SendingFailed: Story = {
  args: {
    status: 'error',
    errorMessage: 'Die Anfrage konnte nicht gesendet werden. Bitte prüfen Sie Ihre Internetverbindung.',
  },
};

export const Sending: Story = { args: { status: 'sending' } };

export const Sent: Story = { args: { status: 'sent' } };
