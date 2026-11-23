import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { ContactForm, ContactFormValues } from '../../forms/contact-form/contact-form';
import { inContainer } from '../block-decorator';
import { ContactFormBlock } from './contact-form-block';

const Form = () => {
  const [values, setValues] = useState<ContactFormValues>({
    name: '',
    email: '',
    phone: '',
    topic: 'Lichtplanung',
    message: '',
  });

  return (
    <ContactForm
      formId="kontakt"
      values={values}
      onChange={(field, value) => setValues((current) => ({ ...current, [field]: value }))}
      onSubmit={() => undefined}
      status="idle"
      topics={['Lichtplanung', 'Lichtberatung']}
      privacyHref="#"
      honeypot={{ name: 'website' }}
    />
  );
};

const meta: Meta<typeof ContactFormBlock> = {
  title: 'Blocks/ContactForm',
  component: ContactFormBlock,
  args: {
    anchorId: 'kontaktformular',
    title: 'Schreiben Sie uns',
    intro: 'Wir melden uns innert zwei Arbeitstagen.\nFür dringende Anliegen rufen Sie uns an.',
    direct: {
      phone: '+41 71 000 00 00',
      email: 'hallo@example.com',
      address: ['Musterstrasse 1', '9000 St. Gallen'],
      mapsHref: '#karte',
    },
    children: <Form />,
  },
  parameters: { layout: 'fullscreen' },
  decorators: [inContainer],
};

export default meta;
type Story = StoryObj<typeof ContactFormBlock>;

export const Default: Story = {};

export const WithoutTitleAndIntro: Story = { args: { title: undefined, intro: undefined } };

export const WithoutDirectContact: Story = { args: { direct: null } };
