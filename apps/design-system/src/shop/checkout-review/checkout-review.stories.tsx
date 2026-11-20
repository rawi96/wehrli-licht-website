import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CheckoutReview } from './checkout-review';

const meta: Meta<typeof CheckoutReview> = {
  title: 'Shop/CheckoutReview',
  component: CheckoutReview,
  args: {
    intro: 'Bitte prüfen Sie Ihre Angaben. Mit «Bestellung abschliessen» wird die Bestellung verbindlich ausgelöst.',
    contact: { name: 'Alex Muster', email: 'hallo@example.com', phone: '079 000 00 00' },
    shipping: { method: 'Versand per Post', address: 'Musterweg 1, 1000 Musterstadt, Schweiz', deliveryTime: '2–3 Wochen' },
    payment: { title: 'Vorauskasse', description: 'Überweisung vor Lieferung oder Abholung' },
    comment: 'Bitte vor der Lieferung\nkurz anrufen.',
    lines: [
      { id: '1', name: 'Pendelleuchte', quantity: 1, selectionsLabel: 'Farbe: Weiss', total: 'CHF 290.00' },
      { id: '2', name: 'Stehleuchte', quantity: 2, total: 'CHF 1’080.00' },
    ],
    subtotal: 'CHF 1’370.00',
    shippingCost: 'CHF 45.00',
    total: 'CHF 1’415.00',
    submitLabel: 'Bestellung abschliessen',
    onBack: () => undefined,
    onSubmit: () => undefined,
  },
  decorators: [
    (Story) => (
      <div className="max-w-xl">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CheckoutReview>;

export const Default: Story = {};

export const Checking: Story = { args: { checking: true } };

export const WithError: Story = {
  args: { error: 'Fehler beim Abschliessen. Bitte prüfen Sie Ihre Angaben.', comment: null },
};
