import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CheckoutSuccess } from './checkout-success';

const meta: Meta<typeof CheckoutSuccess> = {
  title: 'Shop/CheckoutSuccess',
  component: CheckoutSuccess,
  args: { status: { kind: 'paid' }, shopHref: '#', websiteHref: '#', contactHref: '#' },
};

export default meta;
type Story = StoryObj<typeof CheckoutSuccess>;

export const Paid: Story = {};

export const Ordered: Story = {
  args: {
    status: {
      kind: 'ordered',
      order: {
        email: 'hallo@example.com',
        number: '3f2a9c1e-0000-4000-8000-000000000000',
        payment: 'Bezahlung vor Ort',
        shipping: 'Versand per Post',
        address: 'Musterweg 1, 1000 Musterstadt, Schweiz',
        deliveryTime: '2–3 Wochen',
        total: 'CHF 305.00',
        comment: 'Bitte vor der Lieferung anrufen.',
        note: 'Bezahlung bei Abholung.',
      },
    },
  },
};

export const EmailFailed: Story = {
  args: {
    status: {
      kind: 'emailFailed',
      message: 'Ihre Zahlung ist eingegangen, die Bestätigung per E-Mail hat jedoch nicht funktioniert.',
    },
  },
};

export const Invalid: Story = { args: { status: { kind: 'invalid' } } };
