import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CheckoutErrorAlert } from './checkout-error-alert';

const meta: Meta<typeof CheckoutErrorAlert> = {
  title: 'Shop/CheckoutErrorAlert',
  component: CheckoutErrorAlert,
  args: {
    message: 'Die Bestellung konnte nicht abgeschlossen werden. Bitte melden Sie sich kurz über unsere Kontaktseite.',
    contactHref: '#',
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
type Story = StoryObj<typeof CheckoutErrorAlert>;

export const Default: Story = {};
