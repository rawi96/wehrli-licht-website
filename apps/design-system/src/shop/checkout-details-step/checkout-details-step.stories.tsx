import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { CheckoutAddress, CheckoutContact, CheckoutDetailsStep } from './checkout-details-step';

const meta: Meta = {
  title: 'Shop/CheckoutDetailsStep',
  component: CheckoutDetailsStep,
};

export default meta;

const Example = ({ showAddress, error }: { showAddress?: boolean; error?: string }) => {
  const [contact, setContact] = useState<CheckoutContact>({
    firstName: 'Alex',
    lastName: 'Muster',
    email: 'hallo@example.com',
    phone: '',
  });
  const [address, setAddress] = useState<CheckoutAddress>({ street: '', postalCode: '', city: '' });
  const [comment, setComment] = useState('');

  return (
    <div className="max-w-xl">
      <CheckoutDetailsStep
        contact={contact}
        onContactChange={setContact}
        showAddress={showAddress}
        address={address}
        onAddressChange={setAddress}
        country={{ code: 'CH', label: 'Schweiz' }}
        contactHref="#"
        comment={comment}
        onCommentChange={setComment}
        error={error}
        onBack={() => undefined}
        onSubmit={(event) => event.preventDefault()}
      />
    </div>
  );
};

export const Pickup: StoryObj = { render: () => <Example /> };

export const WithAddress: StoryObj = { render: () => <Example showAddress /> };

export const WithError: StoryObj = { render: () => <Example error="Bitte eine gültige Telefonnummer angeben." /> };
