import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { FieldError, FormError, Label, Select, Textarea, TextInput } from './field';

const meta: Meta = {
  title: 'Forms/Field',
  parameters: {
    docs: {
      description: {
        component:
          'Label, text input, textarea, select and error messages. Controls take `value` and call `onChange` with the new value. Connect an error with `invalid` and `describedBy`.',
      },
    },
  },
};

export default meta;

const Controls = ({ error }: { error?: string }) => {
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('Lichtplanung');
  const [message, setMessage] = useState('');

  return (
    <div className="grid max-w-xl gap-4">
      <div>
        <Label htmlFor="name">Name *</Label>
        <TextInput
          id="name"
          value={name}
          onChange={setName}
          autoComplete="name"
          required
          invalid={!!error}
          describedBy={error ? 'name-error' : undefined}
        />
        <FieldError id="name-error" message={error} />
      </div>
      <div>
        <Label htmlFor="topic">Anliegen</Label>
        <Select
          id="topic"
          value={topic}
          onChange={setTopic}
          options={['Lichtplanung', 'Lichtberatung', 'Reparatur'].map((value) => ({ value, label: value }))}
        />
      </div>
      <div>
        <Label htmlFor="message">Nachricht</Label>
        <Textarea id="message" value={message} onChange={setMessage} rows={6} />
      </div>
    </div>
  );
};

export const Default: StoryObj = { render: () => <Controls /> };

export const WithError: StoryObj = { render: () => <Controls error="Bitte geben Sie Ihren Namen ein." /> };

export const FormErrorMessage: StoryObj = {
  render: () => <FormError>Die Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.</FormError>,
};
